(function () {
    var binaryTree = new BinaryTree(null),
        isTraversaling = false;
        
    // 生成4层的二叉树。每个节点的value都是一个DOM对象
    binaryTree.generate(4, function(node) {
        node = node || document.body;
        
        var divEle = document.createElement('div');
        divEle.className = 'node';
        node.appendChild(divEle);
        
        return divEle;
    });

    document.getElementById('buttons')
    .addEventListener('click', function(e) {
        if (!e.target.matches('button[data-type]') ) return;
        if (isTraversaling) return;
        
        var animationArray = [], // 动画队列
            timeout = 0;    
        isTraversaling = true; // 动画是否在进行
        
        binaryTree[e.target.dataset.type](function(node) {
            // 遍历每一个节点时，都把定时器推入动画队列以待启动
            animationArray.push(setTimeout.bind(null, function() {
                var active = document.querySelector('.active'); 
                
                if(active) active.classList.remove('active');
                node.classList.add('active');
            }));
            
        });
        
        // 最后给动画队列推入一个善后用的定时器
        animationArray.push(setTimeout.bind(null, function(){
            
            document.querySelector('.active').classList.remove('active');
            isTraversaling = false;
            
        }));
        
        // 启动动画队列
        animationArray.forEach(function(animation){
            animation(timeout += 500);
        });
    });
    
}());

