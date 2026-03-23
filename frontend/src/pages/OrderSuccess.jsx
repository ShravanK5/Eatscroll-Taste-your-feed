import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChefHat, Bike, PackageCheck } from 'lucide-react';

export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () { navigate('/'); };
  }, [navigate]);

  return (
    <div className="h-full bg-dark flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-heart-pop"><CheckCircle2 size={48} className="text-green-500" /></div>
      <h1 className="text-3xl font-display font-bold mb-2">Order Placed!</h1>
      <p className="text-gray-400 mb-12">The restaurant has started preparing your food.</p>
      <div className="w-full max-w-xs space-y-6 text-left relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-gradient-to-b before:from-amber before:to-dark-3">
        {[
          { icon: ChefHat, title: "Preparing", desc: "Your food is being cooked", active: true },
          { icon: Bike, title: "On the way", desc: "Assigning delivery partner", active: false },
          { icon: PackageCheck, title: "Delivered", desc: "Enjoy your meal!", active: false }
        ].map((step, i) => (
          <div key={i} className="relative flex items-center gap-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${step.active ? 'bg-amber text-white' : 'bg-dark-3 text-gray-500 border border-dark-2'}`}><step.icon size={20} /></div>
            <div><h3 className={`font-bold ${step.active ? 'text-white' : 'text-gray-500'}`}>{step.title}</h3><p className="text-xs text-gray-500">{step.desc}</p></div>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/')} className="mt-16 w-full glass text-white py-4 rounded-2xl font-bold">Back to Home</button>
    </div>
  );
}