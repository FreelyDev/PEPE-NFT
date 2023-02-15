import './roadMap.scss'

export default function RoadMap() {
    const roadMapData = [
        {
            title: 'Q4 2022',
            text: ["- Reboot of Its Just PEPE","- PEPE Official website launch","- PEPE NFT Reveals"
            ]
        },
        {
            title: 'Q1 2023',
            text: ["- PEPE NFT Launch & Mint","- PEPE Staking Platform Launch", "- PEP Coin Release & Staking Rewards"]
        },
        
        {
            title: 'Q2 2023',
            text: ["- PEPE Lands Launch","-	BattlePEPE Beta Launch", "- PEPE Marketplace Launch"]
        },
        
    ]
    
    return (
        <div className="roadMap" style={{backgroundImage:`url('assets/tihomir-nyagolov-jb-var2-bach-4k-sgn.jpg')`}}>
            <div className="scroll" id="roadmap"></div>
            <div className="roadMapContent">
                <h1>ROADMAP</h1>
                <div className="wrapper">
                    {roadMapData.map((d, i) => (
                        <div 
                            className={`node node${i}`} 
                            data-aos="fade-left" key={i}
                            data-aos-duration="1000"
                            data-aos-delay={`${i * 100}`}
                        >
                            <div className="circle">
                                <h2>{d.title}</h2>
                            </div>
                            <div className="text">
                                {d.text.map((e, k)=>(
                                    <p key = {k}>{e}</p>
                                ))}
                                
                                <div className="hiddenTxt"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <img src="/assets/bg_02.jpg" alt="" className="back" />
        </div>
    )
}
