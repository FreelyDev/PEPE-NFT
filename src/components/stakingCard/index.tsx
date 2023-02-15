import './stakingCard.scss';
import Gallery from 'components/gallery';
import Loader from 'components/loader/Loader';
import { BigNumber } from 'ethers';

type NftBoxProps = {
    nfts?: BigNumber[]

    nfts_staked_day?: BigNumber[]
    nfts_staked_week?: BigNumber[]
    nfts_staked_month?: BigNumber[]

    isStaked?: boolean
    dataLoaded?: boolean
    OnStake?: any
    OnUnStake?: any

    selectdNftIds?: string[]
    setSelectedNftIds?: (id: string[]) => void
    
    selectdNftIds_Day?: string[]
    setSelectedNftIds_Day?: (id: string[]) => void
    
    selectdNftIds_Week?: string[]
    setSelectedNftIds_Week?: (id: string[]) => void
    
    selectdNftIds_Month?: string[]
    setSelectedNftIds_Month?: (id: string[]) => void

    lastUpdatedForDay?: number;
    lastUpdatedForWeek?: number;
    lastUpdatedForMonth?: number;

};

export default function NftBox(
    { 
        nfts, 
        nfts_staked_day, 
        nfts_staked_week, 
        nfts_staked_month, 
        isStaked, 
        dataLoaded, 
        OnStake, 
        OnUnStake, 

        selectdNftIds, 
        setSelectedNftIds,

        selectdNftIds_Day, 
        setSelectedNftIds_Day,

        selectdNftIds_Week, 
        setSelectedNftIds_Week,

        selectdNftIds_Month, 
        setSelectedNftIds_Month,

        lastUpdatedForDay,
        lastUpdatedForWeek,
        lastUpdatedForMonth

    }: NftBoxProps) {

    const handleSelect = (nftIds) => {
        setSelectedNftIds(selectdNftIds.concat(nftIds))
    }

    const handleDeselect = (nftIds) => {
        setSelectedNftIds(selectdNftIds.filter((nftId) => nftIds.indexOf(nftId) === -1))
    }

    const handleSelect_Day = (nftIds) => {
        setSelectedNftIds_Day(selectdNftIds_Day.concat(nftIds))
    }

    const handleDeselect_Day = (nftIds) => {
        setSelectedNftIds_Day(selectdNftIds_Day.filter((nftId) => nftIds.indexOf(nftId) === -1))
    }

    const handleSelect_Week = (nftIds) => {
        setSelectedNftIds_Week(selectdNftIds_Week.concat(nftIds))
    }

    const handleDeselect_Week = (nftIds) => {
        setSelectedNftIds_Week(selectdNftIds_Week.filter((nftId) => nftIds.indexOf(nftId) === -1))
    }

    const handleSelect_Month = (nftIds) => {
        setSelectedNftIds_Month(selectdNftIds_Month.concat(nftIds))
    }

    const handleDeselect_Month = (nftIds) => {
        setSelectedNftIds_Month(selectdNftIds_Month.filter((nftId) => nftIds.indexOf(nftId) === -1))
    }
    const handleStake = (period) => {
        if(isStaked){
            OnUnStake(period)
            handleDeselect_Day(selectdNftIds_Day)
            handleDeselect_Week(selectdNftIds_Week)
            handleDeselect_Month(selectdNftIds_Month)
        }
        else{
            OnStake(period)
            handleDeselect(selectdNftIds)
        }
        
    }

    return (
        <>
            <div className="item" data-aos="fade-right" style={{ backgroundImage: `url('assets/bar_01.png')` }}>

                <div className="itemHeader">
                    <h3>{`${isStaked ? `STAKED NFTs` : `HOLDING NFTs`}`}</h3>
                </div>
                {dataLoaded ?
                    <>
                        {isStaked ?
                        <>
                            <div className="itemContent">
                                <div className="nftViews">
                                    <Gallery
                                        nfts={nfts_staked_day || []}
                                        label={'24 Hours'}
                                        isStaked
                                        selectedIds={selectdNftIds_Day}
                                        onSelect={(nftIds) => handleSelect_Day(nftIds)}
                                        onDeselect={(nftIds) => handleDeselect_Day(nftIds)}
                                        onUnstake = {() => { handleStake('Day') }}
                                        selectedCount = {selectdNftIds_Day.length || 0}
                                        lastUpdated = {lastUpdatedForDay + 86400}
                                    />
                                </div>
                            </div>

                            <div className="itemContent">
                                <div className="nftViews">
                                    <Gallery
                                        nfts={nfts_staked_week || []}
                                        label={'1 Week'}
                                        isStaked
                                        selectedIds={selectdNftIds_Week}
                                        onSelect={(nftIds) => handleSelect_Week(nftIds)}
                                        onDeselect={(nftIds) => handleDeselect_Week(nftIds)}
                                        onUnstake = {() => { handleStake('Week') }}
                                        selectedCount = {selectdNftIds_Week.length || 0}
                                        lastUpdated = {lastUpdatedForWeek + 604800}
                                    />
                                    
                                </div>
                            </div>
                            <div className="itemContent">
                                <div className="nftViews">
                                    <Gallery
                                        nfts={nfts_staked_month || []}
                                        label={'1 Month'}
                                        isStaked
                                        selectedIds={selectdNftIds_Month}
                                        onSelect={(nftIds) => handleSelect_Month(nftIds)}
                                        onDeselect={(nftIds) => handleDeselect_Month(nftIds)}
                                        onUnstake = {() => { handleStake('Month') }}
                                        selectedCount = {selectdNftIds_Month.length || 0}
                                        lastUpdated = {lastUpdatedForMonth + 2592000}
                                    />
                                    
                                </div>
                            </div>
                            
                        </>:
                        <>
                            <div className="itemContent">
                                <div className="nftViews">
                                    <Gallery
                                        nfts={nfts || []}
                                        selectedIds={selectdNftIds}
                                        onSelect={(nftIds) => handleSelect(nftIds)}
                                        onDeselect={(nftIds) => handleDeselect(nftIds)}
                                    />
                                    
                                </div>
                            </div>
                            <div className="btns">
                            <button
                                disabled={selectdNftIds.length === 0}
                                className="stakeBtn button"
                                onClick={() => { handleStake('Day') }}
                                style={{ backgroundImage: `url("assets/button03.png")` }}
                            >Stake For <span>24hrs</span> Lock {selectdNftIds.length || ''}</button>

                            <button
                                disabled={selectdNftIds.length === 0}
                                className="stakeBtn button"
                                onClick={() => { handleStake('Week') }}
                                style={{ backgroundImage: `url("assets/button03.png")` }}
                            >Stake For <span>1 Week</span> Lock {selectdNftIds.length || ''}</button>

                            <button
                                disabled={selectdNftIds.length === 0}
                                className="stakeBtn button"
                                onClick={() => { handleStake('Month') }}
                                style={{ backgroundImage: `url("assets/button03.png")` }}
                            >Stake For <span>1 Month</span> Lock {selectdNftIds.length || ''}</button>

                            </div>
                        </>
                        }
                    </> :
                    <div className="loadingPart">
                        <Loader />
                        <h3>Loading Data</h3>
                    </div>
                }
            </div>
        </>
    )
}
