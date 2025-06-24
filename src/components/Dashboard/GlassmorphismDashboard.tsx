import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Sphere, Box, Plane } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Network, 
  Zap, 
  Brain, 
  Shield,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// 3D Holographic Graph Component
const HolographicGraph: React.FC<{ data: number[]; color: string; position: [number, number, number] }> = ({ 
  data, 
  color, 
  position 
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group 
      ref={meshRef} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      {data.map((value, index) => (
        <Box
          key={index}
          position={[index * 0.3 - 1, value * 0.01, 0]}
          scale={[0.2, value * 0.02, 0.2]}
          args={[1, 1, 1]}
        >
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={0.7}
            emissive={color}
            emissiveIntensity={hovered ? 0.3 : 0.1}
          />
        </Box>
      ))}
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {hovered ? 'Interactive Data' : 'Hover to Explore'}
      </Text>
    </group>
  );
};

// Floating 3D Metric Card
const FloatingMetricCard: React.FC<{ 
  position: [number, number, number]; 
  rotation: [number, number, number];
  title: string;
  value: string;
  color: string;
}> = ({ position, rotation, title, value, color }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group 
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.05 : 1}
    >
      <Plane args={[2, 1]}>
        <meshStandardMaterial 
          color={color}
          transparent 
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </Plane>
      <Text
        position={[0, 0.2, 0.01]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {title}
      </Text>
      <Text
        position={[0, -0.1, 0.01]}
        fontSize={0.25}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {value}
      </Text>
    </group>
  );
};

// Particle System Background
const ParticleField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 1000;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.02} 
        color="#60a5fa" 
        transparent 
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
};

// Main Glassmorphism Dashboard Component
const GlassmorphismDashboard: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [tiltAngle, setTiltAngle] = useState({ x: 0, y: 0 });
  const [isHolographicMode, setIsHolographicMode] = useState(true);

  // Sample data for 3D graphs
  const cpuData = [65, 72, 68, 75, 82, 78, 85, 79, 73, 77];
  const memoryData = [45, 52, 48, 55, 62, 58, 65, 59, 53, 57];
  const networkData = [30, 45, 35, 50, 65, 55, 70, 60, 45, 55];

  // Glass panel metrics
  const metrics = [
    {
      id: 'cpu',
      title: 'CPU Usage',
      value: '73%',
      icon: Cpu,
      color: '#3b82f6',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      data: cpuData
    },
    {
      id: 'memory',
      title: 'Memory',
      value: '57%',
      icon: MemoryStick,
      color: '#8b5cf6',
      gradient: 'from-purple-500/20 to-pink-500/20',
      data: memoryData
    },
    {
      id: 'network',
      title: 'Network',
      value: '55%',
      icon: Network,
      color: '#10b981',
      gradient: 'from-green-500/20 to-emerald-500/20',
      data: networkData
    },
    {
      id: 'storage',
      title: 'Storage',
      value: '42%',
      icon: HardDrive,
      color: '#f59e0b',
      gradient: 'from-amber-500/20 to-orange-500/20',
      data: [40, 42, 38, 45, 48, 44, 50, 46, 42, 44]
    }
  ];

  // AI Status indicators
  const aiStatus = [
    { id: 'health', label: 'Cluster Health', value: '98.7%', status: 'excellent', icon: Shield },
    { id: 'predictions', label: 'AI Predictions', value: '94%', status: 'good', icon: Brain },
    { id: 'automation', label: 'Auto-fixes', value: '127', status: 'active', icon: Zap },
    { id: 'alerts', label: 'Active Alerts', value: '3', status: 'warning', icon: AlertTriangle }
  ];

  // Handle mouse movement for tilt effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setTiltAngle({
      x: (y - 0.5) * 10,
      y: (x - 0.5) * -10
    });
  };

  const handleMouseLeave = () => {
    setTiltAngle({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-black"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Dashboard Container */}
      <div 
        className="relative z-10 p-8"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
                AutoKube Vision
              </h1>
              <p className="text-blue-200/80">Futuristic AI-Powered Kubernetes Dashboard</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsHolographicMode(!isHolographicMode)}
                className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
              >
                {isHolographicMode ? '3D Mode' : '2D Mode'}
              </button>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-green-400 text-sm font-medium">Live</span>
            </div>
          </div>
        </motion.div>

        {/* 3D Holographic Section */}
        {isHolographicMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 h-96 bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
            style={{
              transform: `perspective(1000px) rotateX(${tiltAngle.x}deg) rotateY(${tiltAngle.y}deg)`
            }}
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#60a5fa" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
              
              <ParticleField />
              
              <HolographicGraph 
                data={cpuData} 
                color="#3b82f6" 
                position={[-3, 0, 0]} 
              />
              <HolographicGraph 
                data={memoryData} 
                color="#8b5cf6" 
                position={[0, 0, 0]} 
              />
              <HolographicGraph 
                data={networkData} 
                color="#10b981" 
                position={[3, 0, 0]} 
              />
              
              <FloatingMetricCard
                position={[-2, 2, 1]}
                rotation={[0, 0, 0.1]}
                title="CPU"
                value="73%"
                color="#3b82f6"
              />
              <FloatingMetricCard
                position={[2, 2, 1]}
                rotation={[0, 0, -0.1]}
                title="Memory"
                value="57%"
                color="#8b5cf6"
              />
              
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
            
            <div className="absolute top-4 left-4 text-white/80 text-sm">
              <p>🎮 Drag to rotate • Hover graphs for interaction</p>
            </div>
          </motion.div>
        )}

        {/* Glass Morphism Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${metric.gradient} backdrop-blur-xl border border-white/20 p-6 hover:border-white/40 transition-all duration-500 cursor-pointer`}
              onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Neon glow effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow: `0 0 30px ${metric.color}40, inset 0 0 30px ${metric.color}20`
                }}
              ></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <metric.icon size={24} style={{ color: metric.color }} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                    <div className="text-white/60 text-sm">{metric.title}</div>
                  </div>
                </div>
                
                {/* Mini sparkline */}
                <div className="flex items-end space-x-1 h-8">
                  {metric.data.slice(-8).map((value, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{ backgroundColor: metric.color }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(value / 100) * 100}%` }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Expanded details */}
              <AnimatePresence>
                {selectedMetric === metric.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-white/20"
                  >
                    <div className="text-white/80 text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Peak:</span>
                        <span>{Math.max(...metric.data)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average:</span>
                        <span>{Math.round(metric.data.reduce((a, b) => a + b) / metric.data.length)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trend:</span>
                        <span className="flex items-center">
                          <TrendingUp size={14} className="mr-1 text-green-400" />
                          +2.3%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* AI Status Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/30 backdrop-blur-2xl border border-white/20 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Brain className="mr-3 text-blue-400" size={28} />
              AI Command Center
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-400 text-sm">Neural Network Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiStatus.map((status, index) => (
              <motion.div
                key={status.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <status.icon 
                    size={20} 
                    className={
                      status.status === 'excellent' ? 'text-green-400' :
                      status.status === 'good' ? 'text-blue-400' :
                      status.status === 'active' ? 'text-purple-400' :
                      'text-amber-400'
                    }
                  />
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    status.status === 'excellent' ? 'bg-green-400/20 text-green-400' :
                    status.status === 'good' ? 'bg-blue-400/20 text-blue-400' :
                    status.status === 'active' ? 'bg-purple-400/20 text-purple-400' :
                    'bg-amber-400/20 text-amber-400'
                  }`}>
                    {status.status}
                  </span>
                </div>
                <div className="text-white font-semibold text-lg">{status.value}</div>
                <div className="text-white/60 text-sm">{status.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 flex flex-col space-y-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/25 backdrop-blur-sm border border-white/20"
          >
            <Zap size={24} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/25 backdrop-blur-sm border border-white/20"
          >
            <Target size={24} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default GlassmorphismDashboard;