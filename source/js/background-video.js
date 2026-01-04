document.addEventListener('DOMContentLoaded', function() {
  // 创建视频元素
  const video = document.createElement('video');
  video.src = '/video/background-video.mp4'; // 视频文件路径，需放置在 source/video/ 目录下
  video.loop = true;
  video.autoplay = true;
  video.muted = true; // 自动播放必须静音
  video.playbackRate = 0.8; // 可以调整播放速度
  video.setAttribute('playsinline', ''); // 移动端支持
  
  // 设置视频样式为全屏背景
  video.style.position = 'fixed';
  video.style.top = '0';
  video.style.left = '0';
  video.style.width = '100%';
  video.style.height = '100%';
  video.style.objectFit = 'cover'; // 保持比例填充全屏
  video.style.zIndex = '-1'; // 放在页面最底层
  video.style.opacity = '0.6'; // 可以调整透明度
  
  // 添加视频到页面
  document.body.appendChild(video);
  
  // 确保视频播放
  video.play().catch(error => {
    console.log('视频播放失败:', error);
    // 如果自动播放失败，可以添加一个用户交互事件来触发播放
    document.addEventListener('click', () => {
      video.play().catch(err => console.log('点击播放失败:', err));
    }, { once: true });
  });
});
