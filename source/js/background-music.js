document.addEventListener('DOMContentLoaded', function() {
  const audio = document.createElement('audio');
  audio.src = '/audio/background-music.mp3'; // 请将音乐文件放在 source/audio/ 目录下
  audio.loop = true;
  audio.autoplay = true; // 浏览器通常阻止自动播放，用户需手动点击播放
  audio.style.position = 'fixed';
  audio.style.bottom = '20px';
  audio.style.right = '20px';
  audio.style.zIndex = '9999';
  audio.controls = true;
  audio.classList.add('bg-music-player');
  
  // 添加错误处理，检测不支持的音频格式
  audio.addEventListener('error', function(e) {
    console.error('音频播放错误:', e);
    
    // 检查是否使用了不支持的格式（如KGG）
    const fileExtension = audio.src.split('.').pop().toLowerCase();
    const unsupportedFormats = ['kgg', 'kgm', 'kgma', 'mgg'];
    
    if (unsupportedFormats.includes(fileExtension)) {
      alert('错误：不支持的音频格式 "' + fileExtension + '"。\n\n请将音频转换为MP3、WAV、OGG或AAC格式后再使用。\n\n查看 source/audio/README.md 了解详细说明。');
    }
  });

  // 添加样式美化播放器
  const style = document.createElement('style');
  style.textContent = `
    .bg-music-player { 
      opacity: 0.7; 
      transition: opacity 0.3s; 
    }
    .bg-music-player:hover { opacity: 1; }
  `;
  document.head.appendChild(style);
  document.body.appendChild(audio);
});