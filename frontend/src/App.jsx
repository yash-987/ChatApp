import { Route, Routes,  } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import './App.css';

import ForgetPass from './Components/Authentication/ForgetPass';

import ResetPass from './Components/Authentication/ResetPass';


export default function App() {
	
	// const localStorageUser = JSON.parse(localStorage.getItem('user-info'))
	// useEffect(() => {
	//   if (localStorageUser) {
	//     setUser(localStorageUser)

	//   }
	// },[localStorageUser,setUser])

	return (
		<div className="App">
			<Routes>
				<Route path="/" Component={HomePage} />
				<Route path={`/LoginHelp/user`} Component={ForgetPass} />

				<Route path={`/LoginHelp/reset-password/:token`} Component={ResetPass} />

				<Route path="/chats" Component={ChatPage} />
			</Routes>
		</div>
	);
}
