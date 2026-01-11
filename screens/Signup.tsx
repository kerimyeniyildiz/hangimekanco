import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Link from '../components/AppLink';

const Signup: React.FC = () => {
  const router = useRouter();
  const { signup, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Parola en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);

    const result = await signup(formData.email, formData.password, formData.name);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      // Auto redirect after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  };

  if (authLoading) {
    return (
      <div className="pt-32 pb-12 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (success) {
    return (
      <div className="pt-32 pb-12 min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="w-full max-w-md text-center">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8">
            <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Kayıt Başarılı!</h2>
            <p className="text-gray-600">E-posta adresinize bir doğrulama bağlantısı gönderdik. Lütfen e-postanızı kontrol edin.</p>
            <p className="text-sm text-gray-500 mt-4">Yönlendiriliyorsunuz...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-12 min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-gray-50">
            <h1 className="text-lg font-bold text-gray-800 mx-auto">Kaydolun</h1>
          </div>

          {/* Body */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hangimekan'a Katılın</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder=" "
                    className="w-full border border-gray-300 rounded-t-lg p-4 focus:border-black focus:ring-1 focus:ring-black outline-none transition peer pt-6 pb-2"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    autoComplete="name"
                  />
                  <label className="absolute left-4 top-4 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs pointer-events-none">Ad Soyad</label>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder=" "
                    className="w-full border border-gray-300 border-t-0 p-4 focus:border-black focus:ring-1 focus:ring-black outline-none transition peer pt-6 pb-2"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    autoComplete="email"
                  />
                  <label className="absolute left-4 top-4 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs pointer-events-none">E-posta</label>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder=" "
                    className="w-full border border-gray-300 border-t-0 rounded-b-lg p-4 focus:border-black focus:ring-1 focus:ring-black outline-none transition peer pt-6 pb-2"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    autoComplete="new-password"
                  />
                  <label className="absolute left-4 top-4 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs pointer-events-none">Parola</label>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Parolanız en az 6 karakter içermelidir.
              </p>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-rose-600 text-white font-bold py-3.5 rounded-lg hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Kabul Et ve Devam Et'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">Zaten hesabınız var mı? </span>
              <Link to="/login" className="text-sm font-semibold text-gray-900 underline hover:text-primary">Oturum açın</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
