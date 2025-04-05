/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import { useState } from 'react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    console.log("Signing up:", name, email, password);
    // TODO: API integration
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <input type="text" placeholder="Name" className="border p-2 mb-2 w-full" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" className="border p-2 mb-2 w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="border p-2 mb-2 w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSignup}>Signup</button>
    </div>
  );
}