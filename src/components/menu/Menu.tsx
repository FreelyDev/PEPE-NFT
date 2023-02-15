import "./menu.scss"
import {HashLink} from 'react-router-hash-link'
type MenuType = {
    menuOpen : boolean;
    setMenuOpen(flag:boolean):void;
};

export default function Menu({menuOpen, setMenuOpen}:MenuType) {
    return (
        <div className={"sidebar " + (menuOpen && "active")}>
            <ul>
                <li onClick = {()=> setMenuOpen(false)} className = {"menuItem1 " + (menuOpen && "active")}>
                    <HashLink to="/">Mint</HashLink>
                </li>
                <li onClick = {()=> setMenuOpen(false)} className = {"menuItem2 " + (menuOpen && "active")}>
                <HashLink to="/staking" smooth>Staking</HashLink>
                </li>
                <li onClick = {()=> setMenuOpen(false)} className = {"menuItem3 " + (menuOpen && "active")}>
                <a href='https://opensea.io/collection/itsjustpepenft' target={'_blank'} rel="noreferrer">Collection </a>
                </li>
                <li onClick = {()=> setMenuOpen(false)} className = {"menuItem4 " + (menuOpen && "active")}>
                <a href='https://its-just-pepe.gitbook.io/its-just-pepe' target={'_blank'} rel="noreferrer">Gitbook </a>
                </li>
                {/* <li onClick = {()=> setMenuOpen(false)} className = {"menuItem4 " + (menuOpen && "active")}>
                <HashLink to="/" smooth>PEPE Lands</HashLink>
                </li>

                <li onClick = {()=> setMenuOpen(false)} className = {"menuItem5 " + (menuOpen && "active")}>
                <HashLink to="/" smooth>BattlePEPE</HashLink>
                </li> */}

            </ul>
        </div>
    )
}

