import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import React from 'react'


const Home = () => {

    const loggedIn = { firstName: 'Sarthak', lastName: 'Bathla', email: 'Sarthak@gmail.com' };

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                        type='greeting'
                        title="Welcome,"
                        user={loggedIn?.firstName || 'Guest'}
                        subtext="Manage your Money efficiently."
                    />
                    <TotalBalanceBox
                        accounts={[]}
                        totalBanks={1}
                        totalCurrentBalance={1250.35}
                    />
                </header>
                {/* TRANSACTIONS */}
            </div>
            <RightSidebar user={loggedIn} transactions={[]} banks={[
                { currentBalance: 123.50 },
                { currentBalance: 123.50 }
            ]} />
        </section>
    )
}

export default Home