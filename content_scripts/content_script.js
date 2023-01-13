/* 
   The video element stays the same when you navigate between streams on Twitch.
   The video element changes when you do something like navigate to the Twitch
   homepage from a stream, close the little screen window on the stream you were
   watching, then navigate to a new stream.
*/

let TURNED_DOWN = false;
let VIDEO = null;
const VOLUME_SCALAR = 10;

/**
 * 
 * @param {Node} targetNode
 * @returns {(mutationList: Array, observer: MutationObserver) => void} callback
 */
function adjustVolume(targetNode) {
    return function(mutationList, observer) {
        if (targetNode.hasChildNodes()) {
            if (!TURNED_DOWN) {
                TURNED_DOWN = true;
                console.log("Ads started. Turning volume down.");
                let video = document.querySelector("video");
                console.log(`Initial volume: ${video.volume}`)
                video.volume /= VOLUME_SCALAR;
                console.log(`Reduced volume: ${video.volume}`)
            }
        } else {
            console.log("Ads ended. Turning volume back up.");
            let video = document.querySelector("video");
            video.volume *= VOLUME_SCALAR;
            console.log(`Reverted volume: ${video.volume}`)
            TURNED_DOWN = false;
        }
    }
}

function main() {
    const video = document.querySelector("video");
    if ((video != VIDEO) && (video != null)) {  // New video element.
        console.log("New video to target.")
        TURNED_DOWN = false;  // Video volume auto-resets to original on changing streams.
        VIDEO = video;

        const selector = "[data-a-target=ax-overlay]"
        const targetNode = document.querySelector(selector);        
        if (targetNode == null) {
            console.log(`Selector "${selector}" failed for QuietTwitchAds.`);
            VIDEO = null;
        } else {
            console.log(`Selector "${selector}" success for QuietTwitchAds.`);
            
            observer = new MutationObserver(adjustVolume(targetNode));
            observer.observe(targetNode, {childList: true});
        }
    }
}

window.setInterval(main, 2000);