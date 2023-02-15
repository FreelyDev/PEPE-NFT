import { useEffect, useState } from 'react';
import './stakingSection.scss';
import StakingCard from 'components/stakingCard';
import toast from 'react-hot-toast';
import { useWeb3React } from '@web3-react/core';
import { currentNetwork } from 'utils';
import { claimReward, getStakingEngineInfo, stakeNFTs, unstakeNFTs } from 'utils/contracts';
import { NFTStakingEngineDetail } from 'utils/typs';

type LoadingType = {
    setIsLoading?(flag: boolean): void;
};

export default function SeasonSection({ setIsLoading }: LoadingType) {

    const [imgCount, setImgCount] = useState(0);
    const onLoad = () => {
        setImgCount(imgCount + 1)
    }
    useEffect(() => {
        if (imgCount >= 1) {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
        }
    }, [setIsLoading, imgCount]);

    // ======  selected ID list ======== by XU 
    const [selectedCurrentNFTList, setSelectedCurrentNFTList] = useState([]);
    // ========= selected ID list =========  by XU
    const [selectedStakedNFTList_Day, setSelectedStakedNFTList_Day] = useState([]);
    const [selectedStakedNFTList_Week, setSelectedStakedNFTList_Week] = useState([]);
    const [selectedStakedNFTList_Month, setSelectedStakedNFTList_Month] = useState([]);

    const [isLoadedCurrentNFTList, setIsLoadedCurrentNFTList] = useState(false);
    const [isLoadedStakedNFTList, setIsLoadedStakedNFTList] = useState(false);

    const { connector, library, chainId, account, active } = useWeb3React();
    const [loginStatus, setLoginStatus] = useState(true);
    const [stakingEngineDetail, setStakingEngineDetail] = useState<NFTStakingEngineDetail>(null);
    const [dailyRewards, setDailyRewards] = useState(0.00);
    useEffect(() => {
        const isLoggedin = account && active && chainId === parseInt(currentNetwork);
        setLoginStatus(isLoggedin);

        if (isLoggedin) {
            getStakingEngineInfo(account).then(
            // getStakingEngineInfo('0xBf8fF255aD1f369929715a3290d1ef71d79f8954').then(
                (engineDetail: NFTStakingEngineDetail) => {
                    setStakingEngineDetail(engineDetail);
                    setIsLoadedCurrentNFTList(true);
                    setIsLoadedStakedNFTList(true);
                    let totalRewards = 0;
                    totalRewards += engineDetail?.dailyTokenRewardsForDay * engineDetail?.stakedNFTList_Day.length;
                    totalRewards += engineDetail?.dailyTokenRewardsForWeek * engineDetail?.stakedNFTList_Week.length;
                    totalRewards += engineDetail?.dailyTokenRewardsForMonth * engineDetail?.stakedNFTList_Month.length;
                    setDailyRewards(totalRewards);
                }
            );
        }
    }, [connector, library, account, active, chainId]);
    const stakeSelectedNFT = async (period) => {
        if (!loginStatus) {
            toast.error("Please connect wallet correctly!");
            return;
        }

        if (selectedCurrentNFTList.length <= 0) {
            toast.error("Selcted NFT count should be higher than 0");
            return;
        }

        const load_toast_id = toast.loading("Please wait for Staking...");
        try {
            const bSuccess = await stakeNFTs(chainId, library.getSigner(), account, selectedCurrentNFTList, period);
            if (bSuccess) {
                toast.success("Staking Success!");
                setTimeout(() => {
                    getStakingEngineInfo(account).then((engineDetail: NFTStakingEngineDetail) => {
                        setStakingEngineDetail(engineDetail);
                        setIsLoadedCurrentNFTList(true);
                        setIsLoadedStakedNFTList(true);
                        let totalRewards = 0;
                        totalRewards += engineDetail?.dailyTokenRewardsForDay * engineDetail?.stakedNFTList_Day.length;
                        totalRewards += engineDetail?.dailyTokenRewardsForWeek * engineDetail?.stakedNFTList_Week.length;
                        totalRewards += engineDetail?.dailyTokenRewardsForMonth * engineDetail?.stakedNFTList_Month.length;
                        setDailyRewards(totalRewards);
                    });
                }, 2000);
            } else {
                toast.error("Staking Failed!");
            }
        } catch (error) {
            toast.error("Staking Failed!");
        }
        toast.dismiss(load_toast_id);
    }

    const unstakeSelectedNFT = async (peroid) => {
        if (!loginStatus) {
            toast.error("Please connect wallet correctly!");
            return;
        }

        let selectedStakedNFTList = [];
        if (peroid === "Day") {
            if (Date.now() / 1000 - stakingEngineDetail?.lastUpdatedForDay < 24 * 3600) {
                toast.error("NFTs are still locked!");
                return;
            }
            selectedStakedNFTList = selectedStakedNFTList_Day;
        } else if (peroid === "Week") {
            if (Date.now() / 1000 - stakingEngineDetail?.lastUpdatedForWeek < 7 * 24 * 3600) {
                toast.error("NFTs are still locked!");
                return;
            }
            selectedStakedNFTList = selectedStakedNFTList_Week;
        } else if (peroid === "Month") {
            if (Date.now() / 1000 - stakingEngineDetail?.lastUpdatedForMonth < 30 * 24 * 3600) {
                toast.error("NFTs are still locked!");
                return;
            }
            selectedStakedNFTList = selectedStakedNFTList_Month;
        }

        if (selectedStakedNFTList.length <= 0) {
            toast.error("Selcted NFT count should be higher than 0");
            return;
        }

        const load_toast_id = toast.loading("Please wait for Unstaking...");
        try {
            const bSuccess = await unstakeNFTs(chainId, library.getSigner(), selectedStakedNFTList, peroid);
            if (bSuccess) {
                toast.success("Unstaking Success!");
                setTimeout(() => {
                    getStakingEngineInfo(account).then((engineDetail: NFTStakingEngineDetail) => {
                        setStakingEngineDetail(engineDetail);
                        setIsLoadedCurrentNFTList(true);
                        setIsLoadedStakedNFTList(true);
                        let totalRewards = 0;
                        totalRewards += engineDetail?.dailyTokenRewardsForDay * engineDetail?.stakedNFTList_Day.length;
                        totalRewards += engineDetail?.dailyTokenRewardsForWeek * engineDetail?.stakedNFTList_Week.length;
                        totalRewards += engineDetail?.dailyTokenRewardsForMonth * engineDetail?.stakedNFTList_Month.length;
                        setDailyRewards(totalRewards);
                    });
                }, 2000);
            } else {
                toast.error("Unstaking Failed!");
            }
        } catch (error) {
            toast.error("Unstaking Failed!");
        }
        toast.dismiss(load_toast_id);
    }

    const handleClaim = async () => {
        if (!loginStatus) {
            toast.error("Please connect wallet correctly!");
            return;
        }
        const load_toast_id = toast.loading("Please wait for Claim Reward...");
        try {

            const bSuccess = await claimReward(chainId, library.getSigner());
            if (bSuccess) {
                toast.success("Claiming Success!");
                const engineDetail: NFTStakingEngineDetail = await getStakingEngineInfo(account);
                setStakingEngineDetail(engineDetail);
            } else {
                toast.error("Claiming Failed!");
            }
        } catch (error) {
            toast.error("Claiming Failed!");
        }
        toast.dismiss(load_toast_id);
    }

    return (
        <>
            <div className="seasonSection">
                <img src="/assets/staking_bg.png" alt="" className="back" onLoad={onLoad} />
                <div className="scroll" />
                <div className="seasonContent" >
                    <h1 data-aos="fade-up">Staking</h1>

                    {!loginStatus ?
                        <div className="wrapper" >
                            <div className="noneWallet" data-aos="fade-up" style={{ backgroundImage: `url("assets/bar_05.png")` }}>
                                <h1>Please connect wallet</h1>
                            </div>
                        </div> :
                        <>
                            <div className="wrapper" >
                                <div className="left">

                                <div className="calm">
                                    <img src="/assets/bar_03.png" alt="" className="backImg" onLoad={onLoad}/>
                                    <h2><span className='gray'>REWARDS :</span> <span>{stakingEngineDetail?.earned?.toFixed(2)}</span> $ PEP</h2>
                                    <p>{dailyRewards.toFixed(2)} PEP Rewards Per Day</p>
                                    <button 
                                        className="claimBtn button" 
                                        disabled={!loginStatus} 
                                        onClick={handleClaim}
                                        style={{backgroundImage: `url("assets/button01.png")`}}
                                    >CLAIM
                                    </button>
                                </div>

                                    <StakingCard
                                        nfts={stakingEngineDetail?.currentNFTList}
                                        dataLoaded={isLoadedCurrentNFTList}

                                        selectdNftIds={selectedCurrentNFTList}
                                        setSelectedNftIds={setSelectedCurrentNFTList}
                                        OnStake={stakeSelectedNFT}
                                    />
                                </div>
                                <div className="right">
                                    <StakingCard

                                        nfts_staked_day={stakingEngineDetail?.stakedNFTList_Day}
                                        nfts_staked_week={stakingEngineDetail?.stakedNFTList_Week}
                                        nfts_staked_month={stakingEngineDetail?.stakedNFTList_Month}

                                        dataLoaded={isLoadedStakedNFTList}
                                        isStaked

                                        selectdNftIds_Day={selectedStakedNFTList_Day}
                                        setSelectedNftIds_Day={setSelectedStakedNFTList_Day}

                                        selectdNftIds_Week={selectedStakedNFTList_Week}
                                        setSelectedNftIds_Week={setSelectedStakedNFTList_Week}

                                        selectdNftIds_Month={selectedStakedNFTList_Month}
                                        setSelectedNftIds_Month={setSelectedStakedNFTList_Month}
                                        OnUnStake={unstakeSelectedNFT}

                                        lastUpdatedForDay = {Number(stakingEngineDetail?.lastUpdatedForDay || 0)}
                                        lastUpdatedForWeek = {Number(stakingEngineDetail?.lastUpdatedForWeek || 0)}
                                        lastUpdatedForMonth = {Number(stakingEngineDetail?.lastUpdatedForMonth || 0)}
                                    />

                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    )
}



