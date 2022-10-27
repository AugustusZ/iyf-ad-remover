const ABP_URL = "https://chrome.google.com/webstore/detail/adblock-plus-free-ad-bloc/cfhdojbkjhnklbpkdaibdccddilifddb"
const BANNER_CLASSNAME = 'better-iyf-banner-message'

const hackPlayer = () => {
    const video = document.querySelector('video#video_player');

    if (!video) {
        // might not be on the player page
        return
    }

    // kepp playing when video is paused by every-45min 20s ad
    video?.addEventListener('pause', (event) => {
        // check it at the next tick
        setTimeout(() => {
            // "##s" (" | 跳过广告")
            const countDownTextElement = document.querySelector('.control-fix > .second');
            if (countDownTextElement?.textContent === '20') {
                video.play()
            }
        }, 0)
    });

    // prompt link to download ABP when 20s video ad is shown
    video?.addEventListener('durationchange', (e) => {
        const src = e.target.src;
        console.log('Current video URL:', src)
        const isPlayingAdVideo = src.includes("dnvodcdn.me");

        if (isPlayingAdVideo) {
            // create banner element
            const div = document.createElement('div')
            div.classList.add(BANNER_CLASSNAME)
            div.innerHTML = `要是你也想要去除这个20s的广告，可以下载 <a target="_blank" href="${ABP_URL}">Adblock Plus</a> 浏览器插件 ：） ——Better IYF Team`

            // add banner to <vg-overlay-play>
            const overlay = document.querySelector('vg-overlay-play');
            overlay?.appendChild(div)
        } else {
            // remove the banner
            document.querySelector(`.${BANNER_CLASSNAME}`)?.remove()
        }
    })
}

const isPlayPage = () => {
    // e.g. https://www.iyf.tv/play/DruY5qEy5AB?id=NutL0yvlmYB
    return location.href.includes('/play/')
}

// if the user opens the /play page URL directly
if (isPlayPage()) {
    hackPlayer()
} 
// if the user starts from home any other page
else {
    // listen to to URL change. credit: https://stackoverflow.com/a/67825703/7090255 
    let previousUrl = '';
    const observer = new MutationObserver(function (mutations) {
        if (location.href !== previousUrl) {
            previousUrl = location.href;

            // e.g. https://www.iyf.tv/play/2zD6zDhdpsY
            if (isPlayPage()) {
                // now it's actually on the /play page
                hackPlayer()
            }

        }
    });
    observer.observe(document, { subtree: true, childList: true });
}
