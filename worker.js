importScripts('engine/ffmpeg-core.js');
let core;
self.onmessage = async ({data}) => {
  try {
    postMessage({type:'status',text:'Loading the conversion engine…'});
    const parts = await Promise.all([0,1,2,3].map(async i=>{const r=await fetch(`engine/core-${i}.bin`);if(!r.ok)throw Error('Could not load the conversion engine. Check your connection and try again.');return new Uint8Array(await r.arrayBuffer());}));
    const wasm=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let offset=0;for(const p of parts){wasm.set(p,offset);offset+=p.length;}
    core=await createFFmpegCore({wasmBinary:wasm});
    let lastLogs=[];
    core.setLogger(({message})=>{lastLogs.push(message);if(lastLogs.length>25)lastLogs.shift();});
    core.FS.writeFile('input',new Uint8Array(data.buffer));
    core.ffprobe('-v','error','-show_streams','-show_format','-of','json','-o','info.json','input');
    let info;
    try { info=JSON.parse(core.FS.readFile('info.json',{encoding:'utf8'})); if(!Array.isArray(info.streams))throw Error(); } catch { throw Error('This file could not be read. Try a valid MP4, MOV or WebM video.'); }
    core.reset();
    const video=info.streams.find(s=>s.codec_type==='video'&& !s.disposition?.attached_pic);if(!video)throw Error('No video track was found in this file.');
    if(['smpte2084','arib-std-b67'].includes(video.color_transfer))throw Error('This is an HDR video. Export an SDR version from your phone or editor first to preserve accurate colors.');
    const duration=Number(info.format.duration||video.duration);if(!Number.isFinite(duration)||duration<=0)throw Error('Cannot determine the video length. Try exporting the source as MP4 first.');
    if(duration>1800)throw Error('Please use a video shorter than 30 minutes for browser conversion.');
    const length=data.mode==='whatsapp'?data.split:duration;
    const count=Math.ceil(duration/length);const filter=data.framing==='fill'?'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1':'scale=1080:1920:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,setsar=1';
    for(let i=0;i<count;i++){
      const clipDuration=Math.min(length,duration-i*length);
      postMessage({type:'status',text:`Converting ${count>1?`clip ${i+1} of ${count}`:'your video'}…`});
      core.setProgress(({time})=>postMessage({type:'progress',value:Math.min(99,100*(i+Math.max(0,Math.min(1,time/1000000/clipDuration)))/count)}));
      const args=['-ss',String(i*length),'-i','input','-t',String(clipDuration),'-map','0:v:0','-map','0:a:0?','-vf',filter,'-r','30','-c:v','libx264','-preset','fast','-crf','18','-maxrate',data.mode==='whatsapp'?'8M':'12M','-bufsize','24M','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-movflags','+faststart','-map_metadata','-1','output.mp4'];
      core.exec(...args);if(core.ret!==0)throw Error('Conversion failed. The video may use an unsupported codec or exceed available memory. Try a smaller SDR video.');
      const bytes=core.FS.readFile('output.mp4');postMessage({type:'output',bytes,index:i+1,count,duration:clipDuration},[bytes.buffer]);core.FS.unlink('output.mp4');core.reset();
    }
    postMessage({type:'done'});
  } catch(e) {postMessage({type:'error',text:e.message||'Unable to convert this video.'});}
};
