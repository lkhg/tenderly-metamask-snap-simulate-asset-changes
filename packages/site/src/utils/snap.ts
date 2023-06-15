import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Invoke the "update_tenderly_credentials" method from the snap.
 */
export const updateTenderlyAccessKey = async (): Promise<any> => {
  return window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'update_tenderly_credentials',
      },
    },
  });
};

/**
 * Invoke the "send_tenderly_transaction" method from the snap.
 */
export const sendTenderlyTransaction = async (): Promise<any> => {
  return window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'send_tenderly_transaction',
      },
    },
  });
};

export const sendTransaction = async (data: any): Promise<any> => {
  try {
    const [from] = (await window.ethereum.request({
      method: 'eth_requestAccounts',
    })) as string[];

    if (!from) {
      return Promise.reject(Error('Failed to get an account'));
    }

    // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction
    return window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          ...data,
          from,
        },
      ],
    });
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const sendSuccessfulTransaction = async (): Promise<any> => {
  try {
    const [from] = (await window.ethereum.request({
      method: 'eth_requestAccounts',
    })) as string[];

    if (!from) {
      return Promise.reject(Error('Failed to get an account'));
    }

    // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction
    return window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from,
          to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          value: '0x0',
          data: '0xa9059cbb000000000000000000000000fc43f5f9dd45258b3aff31bdbe6561d97e8b71de00000000000000000000000000000000000000000000000000000000000f4240',
        },
      ],
    });
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const sendFailedTransaction = async (): Promise<any> => {
  try {
    const [from] = (await window.ethereum.request({
      method: 'eth_requestAccounts',
    })) as string[];

    if (!from) {
      return Promise.reject(Error('Failed to get an account'));
    }

    // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction
    return window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from,
          to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          value: '0x0',
          data: '0xa9059cbb000000000000000000000000fc43f5f9dd45258b3aff31bdbe6561d97e8b71de000000000000000000000000000000000000000000000000000000e8d4a51000',
        },
      ],
    });
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
