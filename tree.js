var Tree = (function() {


    // 树的节点
    function TreeNode(limit, value) {
        this.value = value;
        this.children = [];

        // warning: 此处为每个TreeNode实例生成了一个不同的函数对象，可能有性能问题
        // 可以利用一个object来缓存limit相同的函数对象（需要借助类似_.partial的高阶函数）
        this.appendChild = this.appendChild.bind(this, limit);
    }

    // value表示根节点的值，n表示这是几叉树
    function Tree(value, n) {
        n = typeof n === 'undefined' ? Infinity : n;
        var Node = TreeNode.bind(null, n);

        this.root = new Node(value);

        // 在这个实例属性上记录这是几叉树
        this.childrenLimit = n;
    }



    // node可以接受一个普通的值，或一个TreeNode，或者一个Tree
    // limit表示这是属于一个几叉树的节点
    TreeNode.prototype.appendChild = function(limit, node) {
        var isTreeNode = node instanceof TreeNode,
            isTree = node instanceof Tree,
            errMessage = '节点本身或某后代节点的子节点个数可能超过了上限';

        // node仅是一个普通的值
        if (!isTree && !isTreeNode) {
            if (this.children.length >= limit) throw Error(errMessage);

            // 做个包装
            this.children.push(new TreeNode(limit, node));
            return this;
        }

        // node是树或者树节点[1]
        if (isTree && node.childrenLimit < limit) {
            this.children.push(node.root);
            return this;
        } else if (isTreeNode && node.children.length < limit) {
            this.children.push(node);
            return this;
        } else {
            throw Error(errMessage);
        }
    };

    // 为树添加先序和后序遍历方法
    Tree.prototype.postorderTraversal = function(callback, finalCB) {
        function traversal(node) {
            if (node.children.length === 0) return;

            callback(node.value);
            node.children.forEach(traversal);
        }

        traversal(this.root);
        
        if(typeof finalCB === 'function') finalCB(this);
        return this;
    };

    Tree.prototype.preorderTraversal = function(callback) {
        function traversal(node) {
            if (node.children.length === 0) return;

            node.children.forEach(traversal);
            callback(node.value);
        }

        traversal(this.root);
        return this;
    };
    
    
    // 添加 初始化一个高度为height的n叉树 的方法
    // initValue表示每个节点的value
    // initValue可以是函数。每创建一个节点，该函数会以该节点的父节点的value为参数被调用；对于根节点，参数是该节点的value
    Tree.prototype.generate = function(height, initValue, n) {
        n = n || this.constructor.childrenLimit; // [2]
        initValue = initValue === undefined ? null : initValue;
        
        this.root.value = typeof initValue === 'function' ? initValue(this.root.value) : initValue;
         
        function append(node, currentHeight){
            if(currentHeight  >= height) return;
            
            for(var i = 0; i < n; i ++) {
                node.children[i] = new TreeNode(n, typeof initValue === 'function' ? initValue(node.value) : initValue);
                append(node.children[i], currentHeight + 1);
            }
        }
        
        append(this.root, 1);
        return this;
    };
    
    return Tree;
} ());

var BinaryTree = (function(Tree) {

    // 二叉树构造函数，借用Tree构造函数
    function BinaryTree(value) {
        Tree.apply(this, [value, 2]);
    }

    // 用于上文的[1]和[2]处
    BinaryTree.childrenLimit = 2;

    // 普通的继承
    BinaryTree.prototype = Object.create(Tree.prototype);
    BinaryTree.prototype.constructor = BinaryTree;
    

    // 添加前中后序遍历的方法
    ['preorderTraversal', 'inorderTraversal', 'postorderTraversal'].forEach(function(name, index) {
        BinaryTree.prototype[name] = function(callback) {
            generateTraversal(index, callback)(this.root);
            return this;
        };
    });

    // 生成遍历函数的函数。order决定了是前、中、后序中的哪一个
    function generateTraversal(order, callback) {

        // 这是实际进行递归遍历的函数    
        return function traversal(node) {
            // 递归的终止条件：没有子节点了
            if (node.children.length === 0) {
                callback(node.value);
                return;
            }

            // 三种遍历方法的唯一区别在于traversal函数作用于节点的顺序
            // 用process数组来确定traversal函数的顺序
            var process = [traversal.bind(null, node.children[0]), traversal.bind(null, node.children[1])],
                callbackBind = callback.bind(null, node.value);

            switch (order) {
                case 0:
                    process.unshift(callbackBind);
                    break;
                case 1:
                    process.splice(1, 0, callbackBind);
                    break;
                case 2:
                    process.push(callbackBind);
                    break;
                default:
                    throw new Error('没有这样的遍历方法');
            }

            // 开始遍历
            process.forEach(function(func) {
                func();
            });
        };
    }

    return BinaryTree;
} (Tree));
