import { createContext, useEffect, useRef, useState } from 'react';
import { songsData } from '../assets/assets';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  const notPrev = useRef();
  const notNext = useRef();

  const [track, setTrack] = useState(songsData[1]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      min: 0
    },
    totalTime: {
      second: 0,
      min: 0
    }
  });

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = async (id) => {
    await setTrack(songsData[id]);
    await audioRef.current.play();
    setPlayStatus(true);
  };

  const previous = async () => {
    if (track.id > 0) {
      notPrev.current.style.cursor = 'pointer';
      await setTrack(songsData[track.id - 1]);
      await audioRef.current.play();
      setPlayStatus(track);
    } else {
      notPrev.current.style.cursor = 'not-allowed';
    }
  };

  const next = async () => {
    if (track.id < songsData.length - 1) {
      notNext.current.style.cursor = 'pointer';
      await setTrack(songsData[track.id + 1]);
      await audioRef.current.play();
      setPlayStatus(track);
    } else {
      notNext.current.style.cursor = 'not-allowed';
    }
  };

  const seekSong = async (e) => {
    audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration)
  }

  useEffect(() => {
    setTimeout(() => {
      audioRef.current.ontimeupdate = () => {
        seekBar.current.style.width =
          Math.floor((audioRef.current.currentTime / audioRef.current.duration) * 100) + '%';
        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            min: Math.floor(audioRef.current.currentTime / 60)
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            min: Math.floor(audioRef.current.duration / 60)
          }
        });
      };
    }, 1000);
  }, [audioRef]);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    notPrev,
    notNext,
    seekSong
  };

  return <PlayerContext.Provider value={contextValue}>{props.children}</PlayerContext.Provider>;
};

export default PlayerContextProvider;
