import Game from "./Game";

declare const google: any;

let adDisplayContainer: any;
let adsLoader: any;
let adsManager: any;

function init(){
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
        console.error("Can't find canvas with id 'canvas'");
        return;
    }
    console.log("Running game");
    const gameContainer = document.getElementById('gameContainer') as HTMLDivElement;

    const game = new Game(canvas);
    game.prepare();
    // game.run();
    const onAdsManagerLoaded = (adsManagerLoadedEvent: any) => {
        adsManager = adsManagerLoadedEvent.getAdsManager();

        adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
        adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onContentPauseRequested);
        adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, onContentResumeRequested);
        adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onAdEvent);

        try {
            adsManager.init(640, 360, google.ima.ViewMode.NORMAL);
            adsManager.start();
        } catch (adError) {
            console.error('AD error: ', adError);
            game.play();
        }
    };
    const onAdError = (adErrorEvent: any) => {
        console.error('Ad error: ' + adErrorEvent.getError().toString());
        adsManager?.destroy();
        game.play();
    }

    const onContentPauseRequested = () => {
        game.pause();
    }

    const onContentResumeRequested = () => {
        game.play();
    }

    const onAdEvent = (adEvent: any) => {
        if (adEvent.type === google.ima.AdEvent.Type.ALL_ADS_COMPLETED) {
            game.play();
        }
    }
    const adContainer = document.getElementById('adContainer') as HTMLDivElement;

    adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, gameContainer);
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);

    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false
    );

    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false
    );

    const requestAd = () => {
        const adsRequest = new google.ima.AdsRequest();
        adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';

        adsRequest.linearAdSlotWidth = 640;
        adsRequest.linearAdSlotHeight = 360;
        adsRequest.nonLinearAdSlotWidth = 640;
        adsRequest.nonLinearAdSlotHeight = 360 / 3;

        adsLoader.requestAds(adsRequest);
    }

    game.onAd = () => {
        game.pause();
        requestAd();
        adDisplayContainer.initialize();
    };

    game.play();
}

window.addEventListener('load', init);
