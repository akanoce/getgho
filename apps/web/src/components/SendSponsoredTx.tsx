import { ChangeEvent, useState } from 'react';
import { useSponsoredTransaction } from '@repo/lfgho-sdk';
import { Address } from 'viem';
import {
    Button,
    Card,
    CardBody,
    FormControl,
    FormLabel,
    Heading,
    Input,
    VStack
} from '@chakra-ui/react';

export const SendSponsoredTx = () => {
    const [amount, setAmount] = useState('0');
    const [addressTo, setAddressTo] = useState('');

    const { sponsoredTransaction } = useSponsoredTransaction({
        callData: '0x',
        sponsorTx: false
    });

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAddressTo(e.target.value);
    };

    const handleSend = () => {
        const amountToBigInt = BigInt(Number(amount) * 1e6);
        sponsoredTransaction({
            to: addressTo as Address,
            value: amountToBigInt
        });
    };

    return (
        <Card>
            <CardBody>
                <VStack spacing={4} alignItems={'flex-start'}>
                    <Heading>Send Sponsored USDC</Heading>
                    <FormControl>
                        <FormLabel>Amount in USDC</FormLabel>
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
    );
};
