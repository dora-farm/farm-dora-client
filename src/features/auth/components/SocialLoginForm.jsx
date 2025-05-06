import React from 'react';
import naver from '@/assets/images/naver.png';
import kakaoN from '@/assets/images/kakaoN.png';
import kakaoI from '@/assets/images/kakaoI.png';
import google from '@/assets/images/google.png';


const SocialLoginButton = ({ onLogin, onRegister, title, className }) => {
    const handleCheck = (provider) => {
        if (onLogin) {
            onLogin(provider);
        }else if (onRegister) {
            onRegister(provider);
        }else {
            console.error("Unable to register");
        }
    };

    return (
        <div className="flex flex-col space-y-3 w-full max-w-2xl p-4 h-full">
            <h2 className={className}>{title}</h2>
            <div className="flex items-center justify-center py-2 border cursor-pointer" onClick={() => handleCheck("naver")}>
                <img src={naver} className="w-20 h-4 mr-2" alt="네이버 로그인" />
                <span>간편 로그인</span>
            </div>
            <div className="flex items-center justify-center py-2 border cursor-pointer" onClick={() => handleCheck("kakao")}>
                <img src={kakaoN} className="w-15 h-4 mr-4 ml-4"/>
                 <img className="h-4 mr-2" src={kakaoI}/>
                <span>간편 로그인</span>
            </div>
            <div className="flex items-center justify-center py-2 border cursor-pointer" onClick={() => handleCheck("google")}>
                <img className="w-20 h-6 mr-2" src={google}/>
                <span>간편 로그인</span>
            </div>
        </div>
    );
};

export default SocialLoginButton;