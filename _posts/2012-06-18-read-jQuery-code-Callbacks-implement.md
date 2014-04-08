---
layout: post
title: jQuery源码分析之Callbacks方法
activePage: blogItem
---

*jQuery.Callbacks*方法非常重要，它在*jQuery*源码中被多次使用，如在*ready*方法、*Deferred*对象中。它主要的作用是提供管理和操作回调函数列表方法，增删回调函数，遍历执行回调函数，设置回调函数执行的上下文环境和参数等。它封装内部核心逻辑代码，返回闭包*self*对象供外部访问/操作回调函数队列*list*。

{%highlight javascript linenos%}
// String to Object flags format cache
// 我们暂且称flagsCache为行为标识符串信息集合，供jQuery.Callbacks函数使用
// flagCache存储信息格式如下：
// {'once':{'once':true},'once memory':{'once':true,'memory':true}}
// 其中key为行为标识符串，value为行为标识符串所包含的行为标识符的信息对象
// 行为标识符串是由空格隔开的多个行为标识符构成的字符串
// 行为标识符则是影响队列里的回调函数执行方式的字符串
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
// 将行为标识符串转换成对象存储到flagsCache中，供jQuery.Callbacks函数使用
function createFlags( flags ) {
    var object = flagsCache[ flags ] = {},
           i, length;
           flags = flags.split( /\s+/ );
    for ( i = 0, length = flags.length; i < length; i++ ) {
        object[ flags[i] ] = true;
    }
    return object;
}

/*
 * Create a callback list using the following parameters:
 *flags:an optional list of space-separated flags that will change how
 *the callback list behaves
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 * Possible flags:
 *once:will ensure the callback list can only be fired once (like a Deferred)
 *
 *memory:  will keep track of previous values and will call any callback added
 *  after the list has been fired right away with the latest "memorized"
 *  values (like a Deferred)
 *
 *unique:  will ensure a callback can only be added once (no duplicate in the list)
 *
 *stopOnFalse: interrupt callings when a callback returns false
 */
 //以上英文为jQuery自带API说明，现用自己的语言说明一下：
 //该函数将创建用于管理回调函数列表的对象
 //参数flags为行为标识字符串，是由空格隔开的多个行为标识符构成的字符串。
 //默认情况下（即不传flags），则回调函数列表如同事件回调函数列表般执行。
 //flags可能的值：
 //(1)once：该行为标识符表示列表中的回调函数仅执行一次
 //(2)memory：该行为标识符表示会将先前执行回调函数用到的值(context和args)放入栈中缓存
 //(3)unique：该行为标识符表示确保放入列表中的回调函数唯一性
 //(4)stopOnFalse：该行为标识符表示当执行列表中的回调函数返回false时将中断后面的回调函数执行
jQuery.Callbacks = function( flags ) {
    // Convert flags from String-formatted to Object-formatted
    // (we check in cache first)
    // 获取行为标识符信息对象
    flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

    var // Actual callback list
    // 存放回调函数的列表
    list = [],
    // Stack of fire calls for repeatable lists
    // 存放调用回调函数所需参数(context和args)放入队列中
    stack = [],
    // Last fire value (for non-forgettable lists)
    // 缓存最近一次执行回调函数列表所用到的值(context和args)
    memory,
    // Flag to know if list is currently firing
    // 标记是否回调函数列表正在执行
    firing,
    // First callback to fire (used internally by add and fireWith)
    // 标记回调函数列表执行开始的下标值
    firingStart,
    // End of the loop when firing
    // 标记回调函数列表执行结束的下标值
    firingLength,
    // Index of currently firing callback (modified by remove if needed)
    // 标记回调函数列表正在执行的下标值
    firingIndex,
    // Add one or several callbacks to the list
    // 向回调函数列表添加函数
    add = function( args ) {
        var i,
            length,
            elem,
            type,
            actual;
        for ( i = 0, length = args.length; i < length; i++ ) {
            elem = args[ i ];
            type = jQuery.type( elem );
            if ( type === "array" ) {
                // Inspect recursively
                // 若元素是数组，则递归，直到元素类型为方法时才放入列表中
                add( elem );
            } else if ( type === "function" ) {
                // Add if not in unique mode and callback is not in
                // 直到elem为方法时，
                // 判断unique标识符是否传入，若是则需判断elem是否已存在列表中；
                // 若非唯一，则执行将elem放入列表中。
                if ( !flags.unique || !self.has( elem ) ) {
                    list.push( elem );
                }
            }
        }
    },
    // Fire callbacks
    // 执行回调函数列表
    // context为上下文环境，必选
    // args为传入回调函数参数，可选
    fire = function( context, args ) {
        args = args || [];
        //判断memory标识符是否传入，
        //如是则memory=[context, args],
        //若非则memory=true
        memory = !flags.memory || [ context, args ];
        //标记列表正在执行
        firing = true;
        //标记列表执行正在执行的下标值
        firingIndex = firingStart || 0;
        //重置列表执行开始位的下标值
        firingStart = 0;
        //标记列表执行长度
        firingLength = list.length;
        for ( ; list && firingIndex < firingLength; firingIndex++ ) {
            //需判断stopOnFalse标识符是否传入，
            //如是则在执行回调函数返回false时中断列表后面的回调函数执行并标记memory=true
            if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
                memory = true; // Mark as halted
                break;
            }
        }
        //标记列表执行完毕
        firing = false;
        if ( list ) {
            //判断once行为标识符是否传入
            if ( !flags.once ) {
                //未传入once行为标识符则判断队列stack是否存值
                if ( stack && stack.length ) {
                    //弹出队列的第一个元素作为调用回调函数列表所需参数(context和args)传入
                    memory = stack.shift();
                    self.fireWith( memory[ 0 ], memory[ 1 ] );
                }
            } else if ( memory === true ) {
                //传入once行为标识符，并且memory=true。
                //执行列表的回调函数后，memory=true只有两种情况：
                //1、memory标识符未传入(即行为标识符串flags包含有memory)。
                //2、stopOnFalse标识符传入(即行为标识符串(flags)包含有stopOnFalse)，
                //并且执行列表回调函数时返回false。
                //此时回调函数列表将被冻结使用，即后面对该列表任何操作都将失效。
                self.disable();
            } else {
                //传入once行为标识符，则置空回调函数列表
                list = [];
            }
        }
    },
    // Actual Callbacks object
    // self为函数jQuery.Callbacks所要返回的对象，其实它是闭包。
    // 函数外部是无法访问的函数jQuery.Callbacks内的变量和函数的。
    // 为了能够提供外部操作回调函数列表，故将self对象返回。
    // self对象的一些方法返回this的目的是为了能够链式调用，这是一个技巧。
    self = {
        // Add a callback or a collection of callbacks to the list
        // 添加回调函数到列表中
        add: function() {
            if ( list ) {
                var length = list.length;
                //调用上面定义的add函数
                add( arguments );
                // Do we need to add the callbacks to the
                // current firing batch?
                // 判断回调函数列表是否正在执行
                if ( firing ) {
                    //如是，则需将firingLength重置为添加元素后的列表长度
                    //新增的回调函数能够被执行到，具体原因见上面的函数fire实现
                    firingLength = list.length;
                } 
                // 如非，则判断memory是否缓存有最近一次执行回调函数列表时所用的值(context和args)
                else if ( memory && memory !== true ) {
                    // With memory, if we're not firing then
                    // we should call right away, unless previous
                    // firing was halted (stopOnFalse)
                    // 如是，则将回调函数列表执行的开始下标设置为新增的元素下标值，
                    // 并将memory缓存的两个值作为参数传给fire函数调用
                    firingStart = length;
                    fire( memory[ 0 ], memory[ 1 ] );
                }
            }
            return this;
        },
        // Remove a callback from the list
        // 移除指定回调函数列表中指定的元素
        remove: function() {
            if ( list ) {
                var args = arguments,
                argIndex = 0,
                argLength = args.length;
                for ( ; argIndex < argLength ; argIndex++ ) {
                    // 删除指定的元素值每次都需遍历一遍回调函数列表list
                    for ( var i = 0; i < list.length; i++ ) {
                        if ( args[ argIndex ] === list[ i ] ) {
                            // Handle firingIndex and firingLength
                            // 若回调函数列表正在执行中
                            // 则需相应的设置firingIndex和firingLength的值
                            if ( firing ) {
                                if ( i <= firingLength ) {
                                    firingLength--;
                                    if ( i <= firingIndex ) {
                                        firingIndex--;
                                    }
                                }
                            }
                            // Remove the element
                            // 由于执行splice列表的元素值将减1
                            // 所以当删除操作执行完后索引变量i也需减1
                            list.splice( i--, 1 );
                            // If we have some unicity property then
                            // we only need to do this once
                            // 判断unique行为标识符是否传入
                            // 如是则无需继续遍历查询需删除的元素是否在列表中
                            // 因为unique行为标识符已确保列表中元素的唯一性
                            // 这是一个技巧
                            if ( flags.unique ) {
                                break;
                            }
                        }
                    }
                }
            }
            return this;
        },
        // Control if a given callback is in the list
        // 检测是否回调函数队列中是否已包含有指定回调函数
        has: function( fn ) {
            if ( list ) {
                var i = 0,
                length = list.length;
                for ( ; i < length; i++ ) {
                    if ( fn === list[ i ] ) {
                        return true;
                    }
                }
            }
            return false;
        },
        // Remove all callbacks from the list
        // 置空回调函数队列list
        empty: function() {
            list = [];
            return this;
        },
        // Have the list do nothing anymore
        // 调用次函数后，终结对回调函数列表的任何操作
        disable: function() {
            list = stack = memory = undefined;
            return this;
        },
        // Is it disabled?
        disabled: function() {
            return !list;
        },
        // Lock the list in its current state
        // 锁住回调函数列表的当前调用状态(context和args)
        lock: function() {
            stack = undefined;
            if ( !memory || memory === true ) {
                self.disable();
            }
            return this;
        },
        // Is it locked?
        // 判定是否已锁住回调函数列表的当前调用状态(context和args)
        locked: function() {
            return !stack;
        },
        // Call all callbacks with the given context and arguments
        // 使用指定的参数(context和args)调回调函数列表
        fireWith: function( context, args ) {
            if ( stack ) {
                if ( firing ) {
                   //若回调函数列表正在执行
                    if ( !flags.once ) {
                        //若未传入once行为标识符
                        //由于回调函数列表正在执行，
                        //所以回调函数列表不能立即使用传入的参数(context和args)执行，
                        //需要将传入的参数(context和args)存入队列stack中。
                        //当回调函数列表执行完毕后，将会逐一使用队列stack中的值再执行回调函数列表，直到队列stack没有元素为止
                        //具体请参看fire函数
                        stack.push( [ context, args ] );
                    }
                } else if ( !( flags.once && memory ) ) {
                    //若回调函数列表已执行完毕，则直接使用传入的参数(context和args)调用回调函数列表
                    fire( context, args );
                }
            }
            return this;
        },
        // Call all the callbacks with the given arguments
        // fire方法是fireWith的特殊化，将fire方法的调用对象即self本身作为context传入fireWith方法中
        fire: function() {
            self.fireWith( this, arguments );
            return this;
        },
        // To know if the callbacks have already been called at least once
        fired: function() {
            return !!memory;
        }
    };
    return self;
};
{%endhighlight%}

