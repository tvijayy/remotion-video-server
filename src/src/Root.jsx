import React from 'react';
import { Composition } from 'remotion';
import { VideoTemplate } from './VideoTemplate';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="SocialMediaVideo"
        component={VideoTemplate}
        durationInFrames={450} // 15 seconds at 30fps
        fps={30}
        width={1080}
        height={1920} // Portrait format for Instagram/TikTok/YouTube Shorts
        defaultProps={{
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          caption: 'Your Caption Here',
          scriptText: 'Your full script text here',
        }}
      />
    </>
  );
};
