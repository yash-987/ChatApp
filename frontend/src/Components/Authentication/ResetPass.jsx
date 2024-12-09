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
import { useNavigate, useParams } from 'react-router-dom';

const ResetPass = () => {
	const { token } = useParams()
	console.log(token)
	const [isloading, setIsLoading] = useState(false);
	const [show, setShow] = useState(false);
	const toast = useToast();
	const [pass, setPass] = useState('');
	const navigate = useNavigate()
	const resetPassword = async () => {
		setIsLoading(true);
		if (!pass) {
			toast({
				title: 'Warning',
				description: 'Please enter password first',
				status: 'warning',
				duration: 2000,
				isClosable: true,
			});
			return;
		}

		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization:	`Bearer ${token}`
				},
			};

			const { data } = await axios.post(
				`
https://talko.onrender.com/api/user/reset-password/${token}`,
				{
					password: pass,
				},
				config
			);

			if (data) {
				toast({
					title: 'Success',
					description: 'Password reset successfully',
					status: 'success',
					duration: 2000,
					isClosable: true,
				});
				
				navigate('/')
			}


		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong with your password reset',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
        } finally {
            setIsLoading(false);
        }
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
			<Heading fontSize={'2xl'}>Reset Password</Heading>
			<FormControl id="email" isRequired>
				<FormLabel>Enter New Password </FormLabel>
				<Input
					onChange={(e) => {
						setPass(e.target.value);
					}}
					value={pass}
					type="password"
					placeholder="Enter New Password"
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
				onClick={resetPassword}
			>
				Reset Password
			</Button>
		</VStack>
	);
};

export default ResetPass;
