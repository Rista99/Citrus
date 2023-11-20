'use client';
import { DepositType, GameType } from '@/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

export default function Home() {
  const [games, setGames] = useState([]);
  const [userDeposits, setUserDeposits] = useState([]);
  const [balance, setBalance] = useState(0);

  const { push } = useRouter();

  // Get available games for user
  const getGames = async () => {
    let jwt = localStorage.getItem('jwt');
    let username = localStorage.getItem('username');
    try {
      const result = await axios.get(`http://localhost:4000/game/${username}`, {
        headers: { Authorization: `bearer ${jwt}` },
      });

      if (result.data) {
        setGames(result.data.games);
      }
    } catch (error: any) {
      if (error?.ressponse?.status === 401) {
        push('/auth/login');
      }
    }
  };

  // Get all user's deposits
  const getUserDeposits = async () => {
    let jwt = localStorage.getItem('jwt');
    let username = localStorage.getItem('username');

    if (!username) {
      localStorage.clear();
      push('auth/login');
    }
    const result = await axios.get(
      `http://localhost:4000/deposits/${username}`,
      {
        headers: { Authorization: `bearer ${jwt}` },
      }
    );

    if (result.status === 401) {
      localStorage.clear();
      push('auth/login');
    }
    if (result.data) {
      setBalance(result.data.balance);
      setUserDeposits(result.data.deposits);
    }
  };

  // Single deposit row
  const depositRow = (item: DepositType) => {
    // formatting Date
    let date = new Date(item.datetime);
    const formattedDate = `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()}. ${date.getHours()}:${date.getMinutes()}`;

    const refundDeposit = async () => {
      try {
        let jwt = localStorage.getItem('jwt');
        let result = await axios.post(
          `http://localhost:4000/rollback`,
          {
            depositId: item._id,
          },
          {
            headers: { Authorization: `bearer ${jwt}` },
          }
        );
        if (result.status === 200) {
          getUserDeposits();
          setBalance(result.data.balance);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };

    return (
      <tr key={item._id} className='table table-fixed w-full'>
        <td className='px-3 py-2 font-small whitespace-nowrap w-1/4'>
          {item.message}
        </td>
        <td className='px-3 py-2 font-small whitespace-nowrap w-1/4'>
          {item.amount}
        </td>
        <td className='px-3 py-2 font-small whitespace-nowrap w-1/4'>
          {formattedDate}
        </td>
        <td className='px-3 py-2 font-small whitespace-nowrap w-1/4'>
          {item.message === 'Adding fudns' && !item.refunded && (
            <button className='btn btn-error btn-sm' onClick={refundDeposit}>
              Refund
            </button>
          )}
        </td>
      </tr>
    );
  };

  // Single game row
  const gameRow = (item: GameType) => {
    const buyGame = async () => {
      try {
        let username = localStorage.getItem('username');
        let jwt = localStorage.getItem('jwt');
        let result = await axios.post(
          `http://localhost:4000/game/buy`,
          {
            game_id: item._id,
            username: username,
          },
          {
            headers: { Authorization: `bearer ${jwt}` },
          }
        );
        if (result.status === 200) {
          getGames();
          setBalance(result.data.balance);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };

    return (
      <tr key={item._id} className='table table-fixed w-full'>
        <td className='px-3 py-2 font-small whitespace-nowrap w-1/4'>
          {item.title}
        </td>
        <td className='px-3 py-2 font-small whitespace-nowrap  w-1/4'>
          {item.creatorName}
        </td>
        <td className='px-3 py-2 font-small whitespace-nowrap  w-1/4'>
          {item.price}
        </td>
        <td className='px-3 py-2 font-small whitespace-nowrap  w-1/4'>
          <button className='btn btn-success btn-sm' onClick={buyGame}>
            Buy
          </button>
        </td>
      </tr>
    );
  };

  const SignOut = () => {
    localStorage.clear();
    push('auth/login');
  };

  useEffect(() => {
    getUserDeposits();
    getGames();
  }, []);

  return (
    <div className='relative flex flex-col justify-center h-screen overflow-hidden'>
      <div className='flex flex-col space-y-8 bg-white p-6 rounded-md shadow-md'>
        <div className='flex justify-between'>
          <h1 className='text-3xl font-bold mb-4'>Games table</h1>
          <div className='flex justify-center align-top gap-5'>
            <h2 className='text-xl font-bold mb-4'>Balance: ${balance}</h2>
            <button className='btn btn-error btn-sm' onClick={SignOut}>
              Sign out
            </button>
            <h2 className='text-xl font-bold mb-4'>Ime</h2>
          </div>
        </div>
        <table className='min-w-full divide-y divide-gray-200 border border-gray-300 '>
          <thead className='bg-gray-50 table table-fixed w-full'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider  w-1/4'>
                Title
              </th>
              <th className='px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider  w-1/4'>
                Creator
              </th>
              <th className='px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider  w-1/4'>
                Price
              </th>
              <th className='px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider w-1/4'>
                Actions
              </th>
            </tr>
          </thead>

          <tbody className='bg-white divide-y divide-gray-200 max-h-[250px]'>
            {Array.isArray(games) && games.map(gameRow)}
          </tbody>
        </table>
        <h1 className='text-3xl font-bold mb-4'>Account history</h1>{' '}
        <table className='min-w-full divide-y divide-gray-200 border border-gray-300 '>
          <thead className='bg-gray-50 table table-fixed w-full'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider w-1/4'>
                Message
              </th>
              <th className='px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider w-1/4'>
                Amount
              </th>
              <th className='px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider w-1/4'>
                DateTime
              </th>
              <th className='px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider w-1/4'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200 block overflow-y-auto max-h-[250px]'>
            {Array.isArray(userDeposits) && userDeposits.map(depositRow)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
