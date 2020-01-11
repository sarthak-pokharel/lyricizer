(function(window) {
  function lyricizer(lyrics, element) {
    validiateArgs(lyrics,element);
    if(!new.target)throwError("Please construct this object using a new keyword!");
    this.subtitles = arrayizeLyrics(lyrics);
    this.element = element;
    this.events = {"subtitle": []};
    this.currentLyrics = "";
    this.element.ontimeupdate = ({target}) => {
      let ctime = +target.currentTime.toFixed(2), lyrics = this.subtitles;
      lyrics.forEach((lyric,i)=>((lyric[0] < ctime)&& lyrics[i+1] && lyrics[i+1][0] > ctime)?this.sendLyricEvent(lyric[1], i): _=>0);
    };
    this.sendLyricEvent = function(lyrics,i) {
      if(this.currentLyrics == lyrics) return;
      this.currentLyrics = lyrics;
      this.events['subtitle'].forEach(fun=> {
        fun[0].call(this.element, lyrics, i);
      });
    };
    this.on = function(type, func) {
      if(typeof type != "string") throwError("The first parameter expected to be a string with type event");
      if(typeof func != "function") throwError("The second parameter must be a function");
      return this.events[type].push([func]);
    }
  }
  function arrayizeLyrics(__lyrics) {
    return __lyrics.trim().replace(/\n+/g,'\n').split('\n').map(h=>[h.split(' ').shift().split(':').map(x=>+x).reduce((v,f)=>v*60+f),h.split(' ').splice(1).join(' ')]);
  }
  function validiateArgs(lyrics,embed) {
    if(typeof lyrics != 'string') {
      throwError("First argument must be a string");
    }
    else if((typeof  embed != "object") && ((embed instanceof HTMLVideoElement) || (embed instanceof HTMLAudioElement) )) {
      throwError("Invalid Second Argument. ");
    }
  }
  function throwError(msg) {
    throw new Error(msg);
  }
  window.lyricizer  = window.lyricizer || lyricizer;
})(this.window);
