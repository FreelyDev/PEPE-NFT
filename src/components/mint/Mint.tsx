import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Timer from '../timer/Timer';
import './mint.scss'
import { NFTMintEngineDetail } from 'utils/typs';
import { getMintEngineInfo, mintNFTs } from 'utils/contracts';

type LoadingType = {
    setIsLoading?(flag: boolean): void;
};

export default function Mint({ setIsLoading }: LoadingType) {

    const [imgCount, setImgCount] = useState(0);
    const onLoad = () => {
        setImgCount(imgCount + 1)
    }
    useEffect(() => {
        if (imgCount >= 2) {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
        }
    }, [setIsLoading, imgCount]);

    const [showMint, setShowMint] = useState(false)
    const [mintCount, setMintCount] = useState(1);

    const decreaseHandle = () => {
        if (mintCount > 0) {
            setMintCount(mintCount - 1)
        }

    }
    const increaseHandle = () => {
        if (mintCount < 30) {
            setMintCount(mintCount + 1)
        }
    }

    const [loginStatus, setLoginStatus] = useState(false);
    const { connector, library, chainId, account, active } = useWeb3React();
    const [mintDetail, setMintDetail] = useState<NFTMintEngineDetail>(null);

    useEffect(() => {
        const isLoggedin = account && active && chainId === parseInt(process.env.REACT_APP_NETWORK_ID, 10);
        setLoginStatus(isLoggedin);
    }, [connector, library, account, active, chainId]);

    useEffect(() => {
        getMintEngineInfo().then((detail) => {
            setMintDetail(detail);
        });
    }, []);

    const mintTokens = async () => {
        if (!loginStatus) {
            toast.error("Please connect wallet correctly!");
            return;
        }

        if (mintCount <= 0) {
            toast.error("Mint Count should be higer than 0");
            return;
        }

        if (mintDetail?.saleStep !== 1) {
            toast.error("NFT Sale is not opened yet. Please wait launch time.");
            return;
        }

        const load_toast_id = toast.loading("Please wait for Mint...");
        try {
            const bSuccess = await mintNFTs(chainId, library.getSigner(), mintCount);
            if (bSuccess) {
                toast.success("Mint Success!");
                setTimeout(() => {
                    getMintEngineInfo().then((detail) => {
                        setMintDetail(detail);
                    });
                }, 2000);
            } else {
                toast.error("Mint Failed!");
            }
        } catch (error) {
            toast.error("Mint Failed!");
        }
        toast.dismiss(load_toast_id);
    };


    return (
        <div className="mint">
            <div className="scroll" id='mint'> </div>
            <div className="mintContent">
                <div className="mintWrapper">
                    <div className="left" data-aos="fade-right">
                        <img src="/assets/mint.gif" alt="" onLoad={onLoad} />
                    </div>
                    <div className="right" data-aos="fade-left">
                        <h1>
                            Mint Its Just PEPE
                        </h1>
                        {showMint === false ?
                            <>
                                <div className="countDown">
                                    <Timer deadLine={0} setShowMint={() => { setShowMint(true) }} />
                                </div>
                            </> :
                            <>
                                <div className="mintCount">
                                    <button
                                        className="mintIncDec"
                                        onClick={decreaseHandle}
                                    >
                                        <i className="fas fa-minus"></i>
                                    </button>

                                    <span className="mintCountValue" style={{}}>{mintCount}</span>
                                    <button
                                        className="mintIncDec"
                                        onClick={increaseHandle}
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                    <button
                                        className="mintNow button"
                                        onClick={mintTokens}
                                    >Mint Now</button>
                                </div>

                            </>}
                        <span className='state'><p>✓ Price : </p> <p> {mintDetail?.price?.toFixed(2)} ETH</p></span>
                        <span className='state'><p>✓ Minted :</p> <p> {mintDetail?.totalSupply} / {mintDetail?.maxSupply}</p></span>

                    </div>
                </div>
            </div>
            <img src="/assets/EFXSes9UCfsyRVoNeQ2ZTB-1200-80.png.webp" alt="" className="back" onLoad={onLoad} />
        </div>
    )
}

