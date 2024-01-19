import { ChangeEvent, useState } from 'react';
import { USDC_SEPOLIA_ADDRESS, useTransactions } from '@repo/lfgho-sdk';
import { Address } from 'viem';
import {
    Button,
    Card,
    CardBody,
    FormControl,
    FormLabel,
    Heading,
    Input,
    VStack,
    HStack
} from '@chakra-ui/react';

export const SendErc20Tx = () => {
    const [amountSponsored, setAmountSponsored] = useState('0');
    const [addressToSponsored, setAddressToSponsored] = useState('');

    const [amount, setAmount] = useState('0');
    const [addressTo, setAddressTo] = useState('');

    const handleAmountChangeSponsored = (e: ChangeEvent<HTMLInputElement>) => {
        setAmountSponsored(e.target.value);
    };

    const handleAddressChangeSponsored = (e: ChangeEvent<HTMLInputElement>) => {
        setAddressToSponsored(e.target.value);
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAddressTo(e.target.value);
    };

    const { sponsoredERC20Transaction, sendERC20Transaction } =
        useTransactions();

    const handleSendSponsored = () => {
        const amountToBigInt = BigInt(Number(amountSponsored) * 1e6);

        console.log('amountToBigInt', amountToBigInt);

        sponsoredERC20Transaction({
            to: addressToSponsored as Address,
            value: amountToBigInt,
            tokenAddress: USDC_SEPOLIA_ADDRESS
        });
    };

    const handleSend = () => {
        const amountToBigInt = BigInt(Number(amount) * 1e6);
        console.log('amountToBigInt', amountToBigInt);

        sendERC20Transaction({
            to: addressTo as Address,
            value: amountToBigInt,
            tokenAddress: USDC_SEPOLIA_ADDRESS
        });
    };

    return (
        <HStack justifyContent="center">
            <Card width="100%">
                <CardBody>
                    <VStack spacing={4} alignItems={'flex-start'}>
                        <Heading>Send Sponsored ERC20 with USDC</Heading>
                        <FormControl>
                            <FormLabel>Amount in ERC20</FormLabel>
                            <Input
                                id="amount"
                                type="number"
                                value={amountSponsored}
                                onChange={handleAmountChangeSponsored}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Address to Send</FormLabel>
                            <Input
                                id="address"
                                value={addressToSponsored}
                                onChange={handleAddressChangeSponsored}
                            />
                        </FormControl>
                        <Button
                            disabled={!Number(amount) || !addressTo}
                            onClick={handleSendSponsored}
                        >
                            Send
                        </Button>
                    </VStack>
                </CardBody>
            </Card>

            <Card width="100%">
                <CardBody>
                    <VStack spacing={4} alignItems={'flex-start'}>
                        <Heading>Send ERC20</Heading>
                        <FormControl>
                            <FormLabel>Amount in ERC20</FormLabel>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Address to Send</FormLabel>
                            <Input
                                id="address"
                                value={addressTo}
                                onChange={handleAddressChange}
                            />
                        </FormControl>
                        <Button
                            disabled={!Number(amount) || !addressTo}
                            onClick={handleSend}
                        >
                            Send
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        </HStack>
    );
};
