import {
	Button,
	Center,
	FormControl,
	FormLabel,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	useToast,
	VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';


const ForgetPass = () => {
	const [isloading, setIsLoading] = useState(false);
	const [show, setShow] = useState(false);
	const toast = useToast();
	
	const [inputs, setInputs] = useState({
		email: '',
		
	});
	const forgotPass = async () => {
		setIsLoading(true);
		if (!inputs.email) {
			toast({
				title: 'Error',
				description: 'Please enter your email',
				status: 'wanning',
				duration: 2000,
				isClosable: true,
			});
			setIsLoading(false);
			return;
		}
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};
			const { data } = await axios.post(
				'/api/user/forget-password',
				{
					email: inputs.email,
				},
				config
			);

			if (data) {
				console.log(data);
			

				// toast({
				//     title: 'Success',
				//     description: 'Password reset link sent to your email',
				//     status: 'success',
				//     duration: 2000,
				//     isClosable: true,
				// });
				setIsLoading(false);
				return;
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'No account with this email',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};
	const handleShow = () => {
		setShow(!show);
	};
	return (
		<VStack
			spacing="5px"
			color={'black'}
			mx={'auto'}
			my={'auto'}
			background={'whiteAlpha.800'}
			py={20}
			px={20}
			borderRadius={'2xl'}
			display={'flex'}
			gap={10}
			flexDir={'column'}
		>
			<Heading fontSize={'2xl'}>Forgot Password</Heading>
			<FormControl id="email" isRequired>
				<FormLabel>Enter Your email </FormLabel>
				<Input
					onChange={(e) => {
						setInputs({ ...inputs, email: e.target.value });
					}}
					value={inputs.email}
					type="email"
					placeholder="Enter your Email"
				/>
			</FormControl>
			{/* <FormControl id="password " isRequired>
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
				
			</FormControl> */}

			<Button
				colorScheme="blue"
				w={'100%'}
				mt={15}
				isLoading={isloading}
				onClick={forgotPass}
			>
				Email Me
			</Button>
		</VStack>
	);
};

export default ForgetPass;
