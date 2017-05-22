// 使用立即执行函数表达式(IIFE)，避免污染全局作用域
// 通过传入 window对象，可以使 window对象变为局部变量
// 这样在代码中访问 window对象时，就不需要将作用域链退回到顶层作用域，从而可以更快的访问 window对象
// 将window对象作为参数传入，还可以在代码压缩时进行优化
;( function( window, maxWidth ) {
      // Document对象
  let doc = window.document,
      // 文档根节点
      docEl = doc.documentElement,
      // name="viewport"的 meta节点
      metaEl = doc.querySelector( 'meta[name="viewport"]' ),
      // 设备独立像素(用来区分'普通屏幕'和'视网膜屏')
      dip = window.devicePixelRatio,
      // 是否为iPhone
      isIphone = window.navigator.appVersion.match( /iphone/gi ),
      // 文档宽度
      width,
      // DPR
      dpr = 0,
      // 定时器ID
      tid,
      // 基准像素
      rem;

  function refreshRem() {
    // 获取文档宽度
    width = docEl.getBoundingClientRect().width;
    // width / dpr的到 'CSS像素'
    // '普通屏幕'一个CSS像素 => 一个物理像素
    // '视网膜屏'一个CSS像素 => 四个物理像素
    if ( width / dpr > maxWidth ) {
      // 'CSS像素'最高是540(这里相当于限制了整个页面的宽度不能大于540(如果大于540的话就不会对页面进行缩放)，超过540的话要设置成左右居中，不然巨丑)
      width = maxWidth * dpr;
    }
    // 计算出基准像素
    rem = width / 10;
    // 设置文档的基准像素
    docEl.style.fontSize = rem + 'px';
  }

  // 文档中没有设置'viewport'
  if ( !metaEl ) {
    // 创建一个'meta'节点
    metaEl = doc.createElement( 'meta' )
    // 设置'meta'节点的'name'属性
    metaEl.setAttribute( 'name', 'viewport' );
    // 设置'meta'节点的'content'属性
    metaEl.setAttribute( 'content', 'initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no' );
    // 将'meta'节点注入到head标签中
    doc.head.appendChild( metaEl );
  }

  // iPhone
  if ( isIphone ) {
    // 根据 dip和dpr来设置 缩放比例
    if ( dip >= 3 ) {
      // dpr = 3 => scale = 0.33333
      dpr = 3;
    } else if ( dip >= 2 ) {
      // dpr = 2 => scale = 0.5
      dpr = 2
    } else {
      // dpr = 1 => scale = 1
      dpr = 1;
    }
  // 其他设备(包括Android和iPad)
  } else {
    // dpr = 1 => scale = 1
    dpr = 1;
  }

  //要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次
  refreshRem();

  // 视窗大小发生变化时触发
  window.addEventListener( 'resize', ()=> {
    // 清空定时器，防止执行两次refreshRem函数
    clearTimeout( tid );
    // 延迟300毫秒，重新计算并设置html的'font-size'
    tid = setTimeout( refreshRem, 100 );
  }, false );

  // 重载页面时触发
  window.addEventListener( 'pageshow', ( e )=> {
    // 从缓存中加载页面(浏览器自带的后退功能)
    if ( e.persisted ) {
      // 清空定时器，防止执行两次refreshRem函数
      clearTimeout( tid );
      // 延迟300毫秒，重新计算并设置html的'font-size'
      tid = setTimeout( refreshRem, 100 );
    }
  }, false );

} )( window, 1024 );
