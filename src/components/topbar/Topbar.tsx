import { useWeb3React } from '@web3-react/core';
import AccountModal from 'components/accountModal/AccountModal';
import { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link'
import { truncateWalletString } from 'utils';
import ConnectModal from '../connectModal/ConnectModal';
import './topbar.scss'

type MenuType = {
    menuOpen?: boolean;
    setMenuOpen(flag: boolean): void;
};
export default function Topbar({ menuOpen, setMenuOpen }: MenuType) {
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);

    const [loginStatus, setLoginStatus] = useState(false);
    const { connector, library, chainId, account, active } = useWeb3React();
    useEffect(() => {
        const isLoggedin = account && active && chainId === parseInt(process.env.REACT_APP_NETWORK_ID, 10);
        setLoginStatus(isLoggedin);
    }, [connector, library, account, active, chainId]);

    const [isDown, setIsDown] = useState('')
    const handleDown = (value: string) => {
        setIsDown(value)
    }
    const handleUp = (value: string) => {
        setIsDown(value)
    }

    return (
        <div className="topbar">
            <div className="logo">
                <HashLink to="/#home" ><img src="assets/logo.png" alt="" /></HashLink>
            </div>
            <div className="navList">
                <ul>
                    
                    <li><HashLink to="/" smooth>Mint</HashLink></li>
                    <li><HashLink to="/staking" smooth>Staking</HashLink></li>
                    <li><a href='https://opensea.io/collection/itsjustpepenft' target={'_blank'} rel="noreferrer">Collection </a></li>
                    <li><a href='https://its-just-pepe.gitbook.io/its-just-pepe' target={'_blank'} rel="noreferrer">Gitbook</a></li>
                    {/* <li><HashLink to="/" smooth>PEPE Lands</HashLink></li>
                    <li><HashLink to="/" smooth>BattlePEPE</HashLink></li> */}

                </ul>
            </div>
            <div className="btns">
                <div
                    className={isDown === 'connectBtnDown' ? "connectBtn button connectBtnDown" : "connectBtn button"}
                    onMouseDown={() => { handleDown('connectBtnDown') }}
                    onMouseUp={() => { handleUp('') }}
                    onClick={() => { !loginStatus ? setShowConnectModal(true) : setShowAccountModal(true) }}
                    style={{backgroundImage: `url("assets/button01.png")`}}
                >
                    {loginStatus ? truncateWalletString(account) : "CONNECT WALLET"}
                    
                </div>
               
            </div>

            <div className={(menuOpen ? "hamburger active" : "hamburger")} onClick={() => setMenuOpen(!menuOpen)}>
                <span className="line1"></span>
                <span className="line2"></span>
                <span className="line3"></span>
            </div>
            <AccountModal  showAccountModal={showAccountModal} setShowAccountModal={setShowAccountModal} />
            <ConnectModal showConnectModal={showConnectModal} setShowConnectModal={setShowConnectModal} />
        </div>
    )
}
