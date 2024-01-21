import { useReservesIncentives } from '@/api';
import { useMultipleSupplyWithBorrow } from '@/hooks/useMultipleSupplyWithBorrow';
import { Button } from '@chakra-ui/button';
import { Card, CardBody } from '@chakra-ui/card';
import { Text, VStack } from '@chakra-ui/layout';
import { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';
import { erc20ABI, useContractReads } from 'wagmi';

export const GetGho = ({ address }: { address: string }) => {
    const { data: reservesIncentives } = useReservesIncentives();

    const ghoReserve = reservesIncentives?.formattedReservesIncentives.find(
        (reserve) => reserve.symbol === 'GHO'
    );

    const { data: userBalances } = useContractReads({
        allowFailure: false,
        contracts: reservesIncentives?.formattedReservesIncentives.map(
            (reserveIncentive) => ({
                address: reserveIncentive.underlyingAsset as `0x${string}`,
                abi: erc20ABI,
                functionName: 'balanceOf',
                args: [address]
            })
        )
    });
    const getUserBalance = useCallback(
        (assetIndex: number, decimals: number) => {
            const balance = userBalances?.[assetIndex] as bigint;
            if (!balance) return '0';

            const parsedBalance = formatUnits(balance, decimals);

            return parsedBalance;
        },
        [userBalances]
    );
    const reservesWithBalance = useMemo(
        () =>
            reservesIncentives?.formattedReservesIncentives.map(
                (reserve, index) => ({
                    ...reserve,
                    balance: getUserBalance(index, reserve.decimals ?? 18),
                    underlyingBalanceUSD:
                        Number(reserve.priceInUSD) *
                        Number(getUserBalance(index, reserve.decimals ?? 18))
                })
            ) ?? [],
        [reservesIncentives, getUserBalance]
    );
    const availableReservesWithBalance = useMemo(
        () =>
            reservesWithBalance
                ?.filter((reserve) => reserve.balance !== '0')
                .map((reserve) => ({
                    reserve,
                    amount: reserve.balance,
                    amountInUsd: reserve.underlyingBalanceUSD
                })) ?? [],
        [reservesWithBalance]
    );

    const availableSuppliableReservesWithBalance = useMemo(
        () =>
            availableReservesWithBalance.filter(
                (reserve) => reserve.reserve.supplyCap !== '0'
            ),
        [availableReservesWithBalance]
    );
    const { mutate: multipleSupplyAndBorrow, isSupplyTxLoading } =
        useMultipleSupplyWithBorrow({
            toBorrow: ghoReserve,
            toSupply: availableSuppliableReservesWithBalance
        });

    return (
        <Card>
            <CardBody>
                <VStack>
                    <Text>Get as much go as possible from your balances</Text>
                    <Text>Supply everything and transform it to gho</Text>
                    <Button
                        size={'sm'}
                        colorScheme={'green'}
                        isLoading={isSupplyTxLoading}
                        onClick={() => multipleSupplyAndBorrow()}
                    >
                        All-in Gho
                    </Button>
                </VStack>
            </CardBody>
        </Card>
    );
};
