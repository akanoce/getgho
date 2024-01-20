import { useReserves, useUserReservesIncentives } from '@/api';
import { tokenToAddress, variableDebtTokens } from '@/const';
import { useApproveDelegation } from '@/hooks/useApproveDelegation';
import {
    Button,
    Card,
    CardBody,
    FormControl,
    FormLabel,
    HStack,
    Heading,
    Input,
    Select,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Spinner,
    VStack
} from '@chakra-ui/react';
import { ChangeEvent, useMemo, useState } from 'react';

type Props = {
    userAddress: string;
};

export const DelegateCreditTx = ({ userAddress }: Props) => {
    const [address, setAdddress] = useState<string>('');
    const [collateralPercentage, setCollateralPercentage] = useState<number>(0);
    const [selectedToken, setSelectedToken] = useState<string>('');

    const { data: userReservesIncentives } =
        useUserReservesIncentives(userAddress);

    const { data: reserves, isLoading: reservesLoading } = useReserves();

    const userReserves =
        userReservesIncentives?.formattedUserSummary.userReservesData;

    const delegatableTokens = useMemo(() => {
        return reserves?.formattedReserves
            .filter((reserve) => reserve.isIsolated === false)
            .map((reserve) => reserve.symbol);
    }, [reserves]);

    const tokenDecimals = useMemo(() => {
        return reserves?.formattedReserves.filter(
            (reserve) => reserve.symbol === selectedToken
        )[0]?.decimals;
    }, [reserves, selectedToken]);

    const selectedTokenAddress = useMemo(() => {
        return tokenToAddress[selectedToken as string];
    }, [selectedToken]);

    const selectedUserReserve = useMemo(() => {
        return userReserves?.filter(
            (reserve) => reserve.underlyingAsset === selectedTokenAddress
        )[0];
    }, [selectedTokenAddress, userReserves]);

    const debtTokenAddress = useMemo(() => {
        return variableDebtTokens[selectedToken as string];
    }, [selectedToken]);

    const collateralLTV = useMemo(() => {
        return Number(
            reserves?.formattedReserves.filter(
                (reserve) => reserve.symbol === selectedToken
            )[0]?.formattedBaseLTVasCollateral
        );
    }, [reserves, selectedToken]);

    const collateralToDelegate = useMemo(() => {
        return (
            Number(selectedUserReserve?.underlyingBalance ?? 0) *
            collateralLTV *
            collateralPercentage
        );
    }, [selectedUserReserve, collateralPercentage, collateralLTV]);

    console.log({
        selectedUserReserve,
        collateralToDelegate,
        debtTokenAddress,
        tokenDecimals
    });

    const { mutate } = useApproveDelegation({
        delegatee: address,
        debtTokenAddress,
        amount: `${Number(collateralToDelegate * 10 ** (tokenDecimals ?? 0)).toFixed(0)}`
    });

    const handleAddressChangeSponsored = (e: ChangeEvent<HTMLInputElement>) => {
        setAdddress(e.target.value);
    };

    if (reservesLoading === true) {
        <HStack justifyContent="center">
            <Card width="100%">
                <Spinner />
            </Card>
        </HStack>;
    }

    return (
        <HStack justifyContent="center">
            <Card width="100%">
                <CardBody>
                    <VStack spacing={4} alignItems={'flex-start'}>
                        <Heading>Delegate Collateral</Heading>
                        <FormControl>
                            <Select
                                placeholder="Select option"
                                onChange={(e) =>
                                    setSelectedToken(e.target.value)
                                }
                            >
                                {delegatableTokens &&
                                    delegatableTokens.map((token) => (
                                        <option value={token}>{token}</option>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <HStack
                                w="full"
                                spacing={4}
                                justifyContent="space-between"
                            >
                                <FormLabel>
                                    Slide to select the amount to delegate
                                </FormLabel>
                                <FormLabel>
                                    {collateralToDelegate} {selectedToken}
                                </FormLabel>
                            </HStack>
                            <Slider
                                colorScheme="pink"
                                defaultValue={0}
                                isDisabled={!selectedUserReserve}
                                onChange={(value) =>
                                    setCollateralPercentage(value / 100)
                                }
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Address to Send</FormLabel>
                            <Input
                                id="address"
                                value={address}
                                onChange={handleAddressChangeSponsored}
                            />
                        </FormControl>
                        <Button
                            disabled={!address || !collateralToDelegate}
                            onClick={() => mutate()}
                        >
                            Send
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        </HStack>
    );
};
