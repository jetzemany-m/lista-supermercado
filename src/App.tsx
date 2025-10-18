import React, { useState } from 'react';
import { ShoppingCart, Plus, Trash2, RotateCcw, Check, X } from 'lucide-react';

interface Categoria {
  id: string;
  nombre: string;
  color: string;
}

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
}

interface ProductoSemanal extends Producto {
  cantidad: number;
  comprado: boolean;
}

const App = () => {
  const coloresDisponibles = [
    'bg-red-100 border-red-300',
    'bg-green-100 border-green-300',
    'bg-blue-100 border-blue-300',
    'bg-yellow-100 border-yellow-300',
    'bg-purple-100 border-purple-300',
    'bg-pink-100 border-pink-300',
    'bg-indigo-100 border-indigo-300',
    'bg-orange-100 border-orange-300'
  ];

  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: 'carnes', nombre: 'Carnes Frías', color: 'bg-red-100 border-red-300' },
    { id: 'frutas', nombre: 'Frutas y Verduras', color: 'bg-green-100 border-green-300' },
    { id: 'lacteos', nombre: 'Lácteos', color: 'bg-blue-100 border-blue-300' },
    { id: 'abarrotes', nombre: 'Abarrotes', color: 'bg-yellow-100 border-yellow-300' },
    { id: 'higiene', nombre: 'Higiene', color: 'bg-purple-100 border-purple-300' }
  ]);

  const [baseDatos, setBaseDatos] = useState<Producto[]>([]);
  const [listaSemanal, setListaSemanal] = useState<ProductoSemanal[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('abarrotes');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mostrarFormularioCategoria, setMostrarFormularioCategoria] = useState(false);

  const agregarCategoria = () => {
    if (nuevaCategoria.trim()) {
      const nuevaCat: Categoria = {
        id: `cat-${Date.now()}`,
        nombre: nuevaCategoria.trim(),
        color: coloresDisponibles[categorias.length % coloresDisponibles.length]
      };
      setCategorias([...categorias, nuevaCat]);
      setNuevaCategoria('');
      setMostrarFormularioCategoria(false);
    }
  };

  const agregarABaseDatos = () => {
    if (nuevoProducto.trim()) {
      const producto: Producto = {
        id: Date.now(),
        nombre: nuevoProducto.trim(),
        categoria: categoriaSeleccionada
      };
      setBaseDatos([...baseDatos, producto]);
      setNuevoProducto('');
      setMostrarFormulario(false);
    }
  };

  const agregarAListaSemanal = (producto: Producto, cantidad: number = 1) => {
    const existente = listaSemanal.find(p => p.id === producto.id);
    if (existente) {
      setListaSemanal(listaSemanal.map(p => 
        p.id === producto.id ? { ...p, cantidad } : p
      ));
    } else {
      setListaSemanal([...listaSemanal, { ...producto, cantidad, comprado: false }]);
    }
  };

  const actualizarCantidad = (productoId: number, cantidad: number) => {
    setListaSemanal(listaSemanal.map(p => 
      p.id === productoId ? { ...p, cantidad } : p
    ));
  };

  const toggleComprado = (productoId: number) => {
    setListaSemanal(listaSemanal.map(p => 
      p.id === productoId ? { ...p, comprado: !p.comprado } : p
    ));
  };

  const quitarDeListaSemanal = (productoId: number) => {
    setListaSemanal(listaSemanal.filter(p => p.id !== productoId));
  };

  const limpiarListaSemanal = () => {
    setListaSemanal([]);
  };

  const eliminarDeBaseDatos = (productoId: number) => {
    setBaseDatos(baseDatos.filter(p => p.id !== productoId));
    setListaSemanal(listaSemanal.filter(p => p.id !== productoId));
  };

  const obtenerProductosPorCategoria = (categoriaId: string, lista: Producto[] | ProductoSemanal[]) => {
    return lista.filter(p => p.categoria === categoriaId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">Mi Lista del Supermercado</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setMostrarFormularioCategoria(!mostrarFormularioCategoria)}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                <Plus className="w-4 h-4" />
                Nueva Categoría
              </button>
              <button
                onClick={limpiarListaSemanal}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Limpiar Lista
              </button>
            </div>
          </div>

          {mostrarFormularioCategoria && (
            <div className="bg-green-50 p-4 rounded-lg mt-4 border-2 border-green-200">
              <input
                type="text"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
                placeholder="Nombre de la nueva categoría"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => e.key === 'Enter' && agregarCategoria()}
              />
              <div className="flex gap-2">
                <button
                  onClick={agregarCategoria}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Guardar Categoría
                </button>
                <button
                  onClick={() => {
                    setMostrarFormularioCategoria(false);
                    setNuevaCategoria('');
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Mis Productos</h2>
              <button
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="w-4 h-4" />
                Agregar Producto
              </button>
            </div>

            {mostrarFormulario && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 border-2 border-indigo-200">
                <input
                  type="text"
                  value={nuevoProducto}
                  onChange={(e) => setNuevoProducto(e.target.value)}
                  placeholder="Nombre del producto"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && agregarABaseDatos()}
                />
                <select
                  value={categoriaSeleccionada}
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={agregarABaseDatos}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setMostrarFormulario(false);
                      setNuevoProducto('');
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {baseDatos.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No hay productos aún. ¡Comienza agregando tus productos favoritos!
                </p>
              ) : (
                categorias.map(categoria => {
                  const productos = obtenerProductosPorCategoria(categoria.id, baseDatos);
                  if (productos.length === 0) return null;
                  
                  return (
                    <div key={categoria.id} className={`border-2 rounded-lg p-3 ${categoria.color}`}>
                      <h3 className="font-semibold text-gray-800 mb-2">{categoria.nombre}</h3>
                      <div className="space-y-1">
                        {productos.map(producto => (
                          <div key={producto.id} className="flex items-center justify-between bg-white px-3 py-2 rounded">
                            <span className="text-gray-700">{producto.nombre}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => agregarAListaSemanal(producto, 1)}
                                className="text-green-600 hover:text-green-700 transition"
                                title="Agregar a lista semanal"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => eliminarDeBaseDatos(producto.id)}
                                className="text-red-600 hover:text-red-700 transition"
                                title="Eliminar de base de datos"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Lista de Esta Semana</h2>
            
            {listaSemanal.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Tu lista está vacía</p>
                <p className="text-gray-400 text-sm mt-2">Agrega productos desde tu base de datos</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {categorias.map(categoria => {
                  const productos = obtenerProductosPorCategoria(categoria.id, listaSemanal) as ProductoSemanal[];
                  if (productos.length === 0) return null;
                  
                  return (
                    <div key={categoria.id} className={`border-2 rounded-lg p-3 ${categoria.color}`}>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {categoria.nombre} ({productos.length})
                      </h3>
                      <div className="space-y-1">
                        {productos.map(producto => (
                          <div 
                            key={producto.id} 
                            className={`flex items-center justify-between bg-white px-3 py-2 rounded transition-all ${
                              producto.comprado ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <button
                                onClick={() => toggleComprado(producto.id)}
                                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                  producto.comprado 
                                    ? 'bg-green-500 border-green-500' 
                                    : 'border-gray-300 hover:border-green-400'
                                }`}
                              >
                                {producto.comprado && (
                                  <Check className="w-4 h-4 text-white" />
                                )}
                              </button>
                              <span className="bg-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                                {producto.cantidad}
                              </span>
                              <span className={`text-gray-700 ${producto.comprado ? 'line-through' : ''}`}>
                                {producto.nombre}
                              </span>
                            </div>
                            <div className="flex gap-2 items-center">
                              <select
                                value={producto.cantidad}
                                onChange={(e) => actualizarCantidad(producto.id, parseInt(e.target.value))}
                                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                              >
                                {[1,2,3,4,5,6,7,8,9].map(num => (
                                  <option key={num} value={num}>{num}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => quitarDeListaSemanal(producto.id)}
                                className="text-red-600 hover:text-red-700 transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {listaSemanal.length > 0 && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-indigo-800">
                      Total de productos: {listaSemanal.length}
                    </p>
                    <p className="text-sm text-indigo-600">
                      Comprados: {listaSemanal.filter(p => p.comprado).length} / {listaSemanal.length}
                    </p>
                  </div>
                  {listaSemanal.filter(p => p.comprado).length > 0 && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((listaSemanal.filter(p => p.comprado).length / listaSemanal.length) * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Completado</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;