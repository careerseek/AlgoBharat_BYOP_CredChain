import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useSmartContract } from '../hooks/useSmartContract';

export default function WalletDemo() {
  const { account, connect, disconnect } = useWallet();
  const { sayHello } = useSmartContract();
  const [greeting, setGreeting] = useState<string | null>(null);

  return (
    <div className="p-6 bg-white rounded shadow space-y-4">
      {account ? (
        <>
          <p className="text-sm text-gray-700">
            Connected as <code className="bg-gray-100 px-1 rounded">{account}</code>
          </p>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Disconnect
          </button>
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Your name…"
              id="hello-input"
              className="border px-2 py-1 rounded flex-1"
            />
            <button
              onClick={async () => {
                const name = (document.getElementById('hello-input') as HTMLInputElement).value;
                if (!name) return alert('Enter a name');
                const result = await sayHello(name);
                setGreeting(result || null);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Say Hello
            </button>
          </div>
          {greeting && <p className="mt-2 text-green-700">Contract says: “{greeting}”</p>}
        </>
      ) : (
        <button
          onClick={() => connect()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
