# Bracket/Mounting Plate Configurator

A customizable 3D bracket/mounting plate configurator built with React 19, TypeScript, and Three.js.

## Features

- **Interactive 3D Rendering**: Real-time 3D visualization using Three.js and React Three Fiber
- **CSG Operations**: Constructive Solid Geometry for creating holes and slots
- **Live Configuration**: Real-time parameter adjustments via Leva controls
- **Mobile Support**: Touch-friendly controls and responsive design
- **TypeScript**: Full type safety with strict compiler settings

## Tech Stack

### Core
- **React 19** - Latest React version with improved concurrent features
- **TypeScript** - Strict type checking for reliability
- **Vite** - Fast development and optimized builds

### 3D Rendering
- **Three.js** - WebGL 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers (OrbitControls, AdaptiveDpr, etc.)
- **@react-three/csg** - Runtime CSG operations for boolean geometry

### UI
- **@pmndrs/leva** - Interactive GUI controls for 3D parameters
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
  ├── App.tsx           # Main application component
  ├── index.css         # Global styles with Tailwind
  └── main.tsx          # Entry point
```

## Library Choices & Rationale

### React 19
Chosen for its improved concurrent features and better performance with complex 3D scenes. The new compiler optimizations help reduce unnecessary re-renders.

### TypeScript with Strict Settings
Using the strictest TypeScript configuration ensures type safety across the entire codebase:
- `strict: true` - Enables all strict type checking
- `noUncheckedIndexedAccess` - Prevents undefined array access bugs
- `exactOptionalPropertyTypes` - Stricter optional property handling
- Path aliases (`@/*`) for cleaner imports

### React Three Fiber Ecosystem
- **R3F**: Declarative way to work with Three.js, integrates naturally with React
- **drei**: Provides essential helpers like OrbitControls and performance optimizations
- **CSG**: Enables real-time boolean operations for creating holes and slots

### Leva
Required by the assignment. Provides a professional, easy-to-use GUI for controlling 3D parameters in real-time.

### Tailwind CSS v4
Utility-first approach allows rapid UI development. The v4 release provides better performance and simpler configuration.

## Known Limitations

- **CSG Performance**: Complex boolean operations can be computationally expensive. Performance is optimized through memoization and reasonable geometry segment counts.
- **Browser Compatibility**: Requires WebGL 2.0 support. Most modern browsers (Chrome 56+, Firefox 51+, Safari 15+) are supported.
- **Mobile Performance**: Lower-end mobile devices may experience reduced frame rates with complex geometries. Adaptive DPR helps maintain smooth performance.
- **Export Formats**: Currently limited to visual representation. Future versions will include STL/OBJ/GLTF export functionality.

## Mobile Considerations

The app is optimized for mobile devices:
- Touch-friendly OrbitControls (1 finger rotate, 2 fingers pan/zoom)
- Capped device pixel ratio to prevent GPU overload
- Adaptive DPR for maintaining 60fps during interactions
- Touch-action CSS to prevent browser gesture conflicts

## Development Time

**Total**: ~2 hours

- Project setup & configuration: 30 min
- 3D scene & controls: 45 min
- Styling & responsive layout: 30 min
- Documentation: 15 min

## Next Steps

Refer to `Docs/roadmap.md` for the full development roadmap including:
- Parametric base plate with CSG operations
- Material/texture system
- Units conversion (mm/cm/m/in)
- Export functionality (STL/OBJ/GLTF)
- GitHub Pages deployment

## License

MIT
