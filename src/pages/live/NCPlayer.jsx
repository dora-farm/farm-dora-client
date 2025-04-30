import React, { useEffect, useRef } from 'react';

const NCPlayer = (props) => {
  const playerRef = useRef();
  const { playerId, playlist, autostart, ...otherProps } = props;

  useEffect(() => {
    // ncplayer 스크립트가 로드되었는지 확인
    const loadScript = () => {
      return new Promise((resolve, reject) => {
        if (typeof window.ncplayer !== 'undefined') {
          resolve();    
          return;
        }

        // 스크립트가 없으면 동적으로 로드
        const script = document.createElement('script');
        script.src = 'https://player.vpe.naverncp.com/ncplayer.1.1.3.js?access_key=63fc8d6c0fde5650b8ebc3394017b4f3';
        script.async = true;
        document.body.appendChild(script);
      });
    };

    let playerInstance = null;

    const initPlayer = async () => {
      try {
        await loadScript();
        // 플레이어 초기화
        playerInstance = new window.ncplayer(playerId, {
          playlist: playlist,
          autostart: autostart || false,
          ...otherProps
        });
      } catch (error) {
        console.error('NCPlayer 초기화 오류:', error);
      }
    };

    initPlayer();

    // Clean up
    return () => {
      if (playerInstance && typeof playerInstance.remove === 'function') {
        playerInstance.remove();
      }
    };
  }, [playerId, playlist, autostart, otherProps]);

  return <div id={playerId} ref={playerRef} className="nc-player-container"></div>;
};

export default NCPlayer;