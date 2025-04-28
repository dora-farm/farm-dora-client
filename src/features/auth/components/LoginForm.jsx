import glass from '../../../assets/images/glass.png'

const LoginForm = ({id, setId, saveIdChecked, setSaveIdChecked, loginUser}) => {
    return (
        <form className="flex flex-col space-y-3 w-full max-w-2xl p-4">
            <h2 className="text-xl font-semibold text-center">회원 로그인</h2>
            <div className="border border-gray-300 ml-1 mr-1 mb-1 mt-1">
                <label className="border-r-2 px-5 text-[#8A8A8A] font-light text-xs " htmlFor="username">아이디</label>
                <input
                    id="id"
                    name="id"
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="ml-2 py-2 w-3/4 focus:outline-none"
                />
            </div>
            <div className="border border-gray-300 ml-1 mr-1 mb-1 mt-1">
                <label className="border-r-2 text-[#8A8A8A] px-3.5 text-xs font-light " htmlFor="password">비밀번호</label>
                <input
                    id="pwd"
                    name="pwd"
                    type="password"
                    className="ml-2 py-2 w-3/4 focus:outline-none"
                />
            </div>
            <button type="button" onClick={loginUser} className="bg-[#575757] border-0 text-white py-2 rounded">
                로그인
            </button>

            <div className="flex items-center justify-between text-xs">
                <label className="flex">
                    <input
                        type="checkbox"
                        checked={saveIdChecked}
                        onChange={() => setSaveIdChecked(!saveIdChecked)}
                    />
                    &nbsp;아이디 기억
                </label>
                <div className="flex space-x-2">
                    <img src={glass} className='h-4 border-r-2'/>
                    <div className="space-x-2">
                        <button type="button">아이디 찾기</button>
                        <button type="button">비밀번호 찾기</button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default LoginForm;