import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Link,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { UserAtom } from '../../store/user';

const Login = () => {
	const [user, setUser] = useRecoilState(UserAtom);
	const navigate = useNavigate();
	const [inputs, setInputs] = useState({
		name: '',
		email: '',
		password: '',
	});
	const [show, setShow] = useState(false);
	const toast = useToast();
	const handleShow = () => setShow(!show);
	const [isloading, setIsLoading] = useState(false);
	const [showForgetPass, setShowForgetPass] = useState(false);
	const handleSubmit = async () => {
		setIsLoading(true);
		if (!inputs.email || !inputs.password) {
			toast({
				title: 'Error',
				description: 'Please fill in all fields',
				status: 'error',
				duration: 2000,
				isClosable: true,
				position: 'bottom',
			});
			setIsLoading(false);
			return;
		}

		// API call to login
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.token}`,
				},
			};
			console.log(inputs.email);
			console.log(inputs.password);
			const { data } = await axios.post(
				'/api/user/login',
				{
					email: inputs.email,
					password: inputs.password,
				},
				config
			);

			toast({
				title: 'Login Success',
				description: 'You have been logged in successfully',
				status: 'success',
				duration: 2000,
				isClosable: 'true',
				position: 'bottom',
			});
			localStorage.setItem('user-info', JSON.stringify(data));
			setUser(data);
			if (user) {
				navigate('/chats');
				console.log(user);
			}

			setIsLoading(false);
		} catch (error) {
			console.log(error);
			toast({
				title: 'Error',
				description: `Invalid Username or Password`,
				status: 'error',
				duration: '2000',
				isClosable: 'true',
				position: 'bottom',
			});
			setTimeout(() => {
				setShowForgetPass(true);
			}, 1000/4);
			setIsLoading(false);
		}
	};
	return (
		<VStack spacing="5px" color={'black'}>
			<FormControl id="email" isRequired>
				<FormLabel>Email</FormLabel>
				<Input
					onChange={(e) => {
						setInputs({ ...inputs, email: e.target.value });
					}}
					value={inputs.email}
					type="email"
					placeholder="Enter your Email"
				/>
			</FormControl>
			<FormControl id="password " isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup size={'md'}>
					<Input
						type={show ? 'text' : 'password'}
						value={inputs.password}
						placeholder={'Enter Your password'}
						onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
					/>
					<InputRightElement width={'4.5rem'}>
						<Button h={'1.75rem'} size={'sm'} onClick={handleShow}>
							{show ? 'Hide' : 'Show'}
						</Button>
					</InputRightElement>
				</InputGroup>
				{showForgetPass ?
					(
				<Link
					as={RouterLink}
					to={`/LoginHelp`}
					color={'blue'}
					size={'sm'}
					textDecor={'none'}
				>
					<div>Forgot Password?</div>
				</Link>
				)
				: null}
			</FormControl>

			<Button
				colorScheme="blue"
				w={'100%'}
				mt={15}
				isLoading={isloading}
				onClick={handleSubmit}
			>
				Log In
			</Button>

			<Button
				colorScheme="red"
				w={'100%'}
				onClick={() => {
					setInputs({
						...inputs,
						email: 'guest@example.com',
						password: '123456',
					});
				}}
			>
				Get User Credentials
			</Button>
		</VStack>
	);
};

export default Login;
