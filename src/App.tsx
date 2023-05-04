import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three';
import './App.css'

interface IValuesForm {
  object: number,
  rotationX: number,
  rotationY: number,
  rotationZ: number,
  translationX: number,
  translationY: number,
  translationZ: number,
  scalingX: number,
  scalingY: number,
  scalingZ: number,
  camX: number,
  camY: number,
  camZ: number,
  camCX: number,
  camCY: number,
  camCZ: number,
  fov: number,
  ra: number,
  near: number,
  far: number,
  project_type: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
}

function App() {
  const viewBox = useRef<HTMLDivElement>(null);

  const objects = [
    () => new THREE.BoxGeometry(1, 1, 1),
    () => new THREE.SphereGeometry(1, 64, 32),
    () => new THREE.ConeGeometry(1, 3, 36),
    () => new THREE.CylinderGeometry(1, 1, 3, 32),
    () => new THREE.ConeGeometry(1, 3, 4),
  ];

  const [transformMatrix0, setTransformMatrix0] = useState([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

  const [valuesForm, setValuesForm] = useState<IValuesForm>({
    object: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    translationX: 0,
    translationY: 0,
    translationZ: 0,
    scalingX: 1,
    scalingY: 1,
    scalingZ: 1,
    camX: 0,
    camY: 0,
    camZ: 5,
    camCX: 0,
    camCY: 0,
    camCZ: 0,
    fov: 45,
    ra: 1,
    near: 0.1,
    far: 1000,
    project_type: 0,
    xMin: -1,
    xMax: 1,
    yMin: -1,
    yMax: 1,
  });

  // TODO: Descobrir porque o canvas não tá atualizando.

  const scene = useRef(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | THREE.OrthographicCamera>();
  const objectRef = useRef<THREE.Mesh<THREE.BoxGeometry | THREE.CylinderGeometry | THREE.SphereGeometry, THREE.MeshBasicMaterial>>();
  const renderer = new THREE.WebGLRenderer({ antialias: true, });

  const renderCube = (scaling: { x: number, y: number, z: number }) => {
    return (
      new THREE.BoxGeometry(
        scaling.x,
        scaling.y,
        scaling.z
      )
    );
  };

  const updateObjectValues = () => {
    if (objectRef.current) {
      // setObject((prevObject) => {
      //   const newGeometry = prevObject?.clone();

      //   newGeometry?.scale.set(valuesForm.scalingX, valuesForm.scalingY, valuesForm.scalingZ);

      //   return {
      //     ...prevObject,
      //     newGeometry
      //   };
      // });
      objectRef.current.scale.set(valuesForm.scalingX, valuesForm.scalingY, valuesForm.scalingZ);
      objectRef.current.rotation.set(valuesForm.rotationX, valuesForm.rotationY, valuesForm.rotationZ);
      objectRef.current.position.set(valuesForm.translationX, valuesForm.translationY, valuesForm.translationZ);

      setTransformMatrix0(objectRef.current.matrix.elements);
    }
  }
  const renderObject = () => {

    const objectSelcted = objects[valuesForm.object]();

    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const object3D = new THREE.Mesh(
      objectSelcted,
      material
    );

    // if (objectRef.current && scene.current) scene.current.remove(objectRef.current);

    object3D.scale.set(valuesForm.scalingX, valuesForm.scalingY, valuesForm.scalingZ);
    object3D.rotation.set(valuesForm.rotationX, valuesForm.rotationY, valuesForm.rotationZ);
    object3D.position.set(valuesForm.translationX, valuesForm.translationY, valuesForm.translationZ);

    objectRef.current = object3D;

    if (scene.current) scene.current.add(object3D);

    setTransformMatrix0(object3D.matrix.elements);

    console.log({ matrixWorld: object3D.matrixWorld, matrix: object3D.matrix, object: valuesForm.object });

    // if (cameraRef.current && scene.current) {
    //   renderer.render(scene.current, cameraRef.current);
    // }

  }

  const renderCam = () => {
    const newCameras = [
      () => new THREE.PerspectiveCamera(valuesForm.fov, valuesForm.ra, valuesForm.near, valuesForm.far),
      () => new THREE.OrthographicCamera(valuesForm.xMin, valuesForm.xMax, valuesForm.yMax, valuesForm.yMin, valuesForm.near, valuesForm.far)
    ];

    // if (valuesForm.project_type == projectType) {
    //   if (cameraRef.current) {
    //     const setCameras = [
    //       () => {
    //         if (cameraRef.current instanceof THREE.PerspectiveCamera) {
    //           cameraRef.current.fov = valuesForm.fov;
    //           cameraRef.current.aspect = valuesForm.ra;
    //           cameraRef.current.near = valuesForm.near;
    //           cameraRef.current.far = valuesForm.far;
    //         }
    //       },
    //       () => {
    //         if (cameraRef.current instanceof THREE.OrthographicCamera) {

    //           cameraRef.current.left = valuesForm.xMin;
    //           cameraRef.current.right = valuesForm.xMax;
    //           cameraRef.current.top = valuesForm.yMax;
    //           cameraRef.current.bottom = valuesForm.yMin;
    //           cameraRef.current.near = valuesForm.near;
    //           cameraRef.current.far = valuesForm.far;
    //         }
    //       }
    //     ];

    //     setCameras[valuesForm.project_type]();

    //     cameraRef.current.position.set(valuesForm.camX, valuesForm.camY, valuesForm.camZ);

    //     cameraRef.current.lookAt(new THREE.Vector3(valuesForm.camCX, valuesForm.camCY, valuesForm.camCZ));

    //     cameraRef.current.updateProjectionMatrix();

    //   }
    // }
    // else {
    const camSelected = newCameras[valuesForm.project_type]();

    camSelected.position.set(valuesForm.camX, valuesForm.camY, valuesForm.camZ);

    camSelected.lookAt(new THREE.Vector3(valuesForm.camCX, valuesForm.camCY, valuesForm.camCZ));

    if (scene.current) {
      // if (cameraRef.current) scene.current.remove(cameraRef.current);
      scene.current.add(camSelected);
    }

    cameraRef.current = camSelected;
    // }

    // return camSelected;
  };

  // const animate = () => {
  //   requestAnimationFrame(animate);

  //   // cube.rotation.x += 0.01;
  //   // cube.rotation.y += 0.01;

  //   if (cameraRef.current) renderer.render(scene, cameraRef.current);
  // }

  const handleToUpdate = () => {
    updateViewContent();

    if (scene.current) scene.current.clear();

    renderObject();
    // updateObjectValues();

    renderCam();

    if (scene.current && cameraRef.current) {
      renderer.render(scene.current, cameraRef.current);
      console.log('Renderizou né...');
      console.log({ scene: scene.current.toJSON(), cameraRef, objectRef });
    }


  };

  const updateViewContent = () => {
    if (viewBox.current) {
      const dimensionsDiv = viewBox.current.getBoundingClientRect();
      renderer.setSize(dimensionsDiv.width, dimensionsDiv.height);
      for (const child of viewBox.current.children) child.remove();
      viewBox.current?.appendChild(renderer.domElement);
    }
  };

  useEffect(() => {
    if (viewBox.current) {
      const dimensionsDiv = viewBox.current.getBoundingClientRect();
      renderer.setSize(dimensionsDiv.width, dimensionsDiv.height);
      for (const child of viewBox.current.children) child.remove();
      viewBox.current?.appendChild(renderer.domElement);
    }
    renderObject();
    renderCam();
    console.log({ scene: scene.current.toJSON() });
    if (scene.current && cameraRef.current) renderer.render(scene.current, cameraRef.current);
    // handleToUpdate();
  }, []);

  useEffect(() => handleToUpdate(), [valuesForm.object]);

  return (
    <div id="main-container">
      <div className="col">
        <div className="input-container">
          <label htmlFor="objects">Objetos</label>
          <select
            value={valuesForm.object}
            onChange={
              ({ currentTarget: elem }) => {
                setValuesForm({ ...valuesForm, object: elem.value as unknown as number });
              }
            }
            name="objects"
            id="objects"
          >
            <option value={0}>Cubo</option>
            <option value={1}>Esfera</option>
            <option value={2}>Cone</option>
            <option value={3}>Cilindro</option>
            <option value={4}>Pirâmide</option>
          </select>
        </div>
        <div>
          Rotação
          <div className="row">
            <div className="input-container">
              <label htmlFor="rotation-x">X</label>
              <input
                id="rotation-x"
                name="rotation-x"
                type="number"
                value={valuesForm.rotationX}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    rotationX: elem.value as unknown as number
                  })
                }
              />
            </div>
            <div className="input-container">
              <label htmlFor="rotation-y">Y</label>
              <input
                id="rotation-y"
                name="rotation-y"
                type="number"
                value={valuesForm.rotationY}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    rotationY: elem.value as unknown as number
                  })
                }
              />
            </div>
            <div className="input-container">
              <label htmlFor="rotation-z">Z</label>
              <input
                id="rotation-z"
                name="rotation-z"
                type="number"
                value={valuesForm.rotationZ}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    rotationZ: elem.value as unknown as number
                  })
                }
              />
            </div>
          </div>
        </div>
        <div>
          Translação
          <div className="row">
            <div className="input-container">
              <label htmlFor="translation-x">X</label>
              <input
                id="translation-x"
                name="translation-x"
                type="number"
                value={valuesForm.translationX}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    translationX: elem.value as unknown as number
                  })
                }
              />
            </div>
            <div className="input-container">
              <label htmlFor="translation-y">Y</label>
              <input
                id="translation-y"
                name="translation-y"
                type="number"
                value={valuesForm.translationY}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    translationY: elem.value as unknown as number
                  })
                }
              />
            </div>
            <div className="input-container">
              <label htmlFor="translation-z">Z</label>
              <input
                id="translation-z"
                name="translation-z"
                type="number"
                value={valuesForm.translationZ}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    translationZ: elem.value as unknown as number
                  })
                }
              />
            </div>
          </div>
        </div>
        <div>
          Escalonamento
          <div className="row">
            <div className="input-container">
              <label htmlFor="scaling-x">X</label>
              <input
                id="scaling-x"
                name="scaling-x"
                type="number"
                value={valuesForm.scalingX}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    scalingX: elem.value as unknown as number
                  })
                }
              />
            </div>
            <div className="input-container">
              <label htmlFor="scaling-y">Y</label>
              <input
                id="scaling-y"
                name="scaling-y"
                type="number"
                value={valuesForm.scalingY}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    scalingY: elem.value as unknown as number
                  })
                }
              />
            </div>
            <div className="input-container">
              <label htmlFor="scaling-z">Z</label>
              <input
                id="scaling-z"
                name="scaling-z"
                type="number"
                value={valuesForm.scalingZ}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    scalingZ: elem.value as unknown as number
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className="col"
        style={{
          flexGrow: 1,
          gap: '1rem',
        }}
      >
        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <h4>3D View</h4>
          <div
            id="container-view"
            ref={viewBox}
            style={{
              flexGrow: 1,
              border: '1px solid black',
              borderRadius: '5px',
              overflow: 'hidden'
            }}
          >
            {/* VIEW */}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5rem',
            height: '22%',
          }}
        >
          <button
            onClick={() => handleToUpdate()}
          >
            ATUALIZAR
          </button>
          <div
            style={{
              height: '100%',
              // width: '25%',
              padding: '0 1rem',
              // display: 'grid',
              // gridTemplateColumns: 'repeat(auto-fit, minmax(1rem, 1fr))',
              // gridTemplateRows: 'repeat(4, minmax(1rem, 1fr))',
              // gridAutoRows: 'minmax(1rem, 1fr)',
              // gap: '0.5rem 1.2rem',
              // gridAutoFlow: 'dense',

              borderLeft: '1px solid black',
              borderRight: '1px solid black',
              borderRadius: '0.5rem',
            }}
          >
            {transformMatrix0.map((item, index) => {
              return (
                <div
                  style={{
                    // flexGrow: 1,
                    // flexBasis: '1rem'
                  }}
                  key={index}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="col">
        <div>
          Câmera
          <div className="row">
            <div className="input-container">
              <label htmlFor="cam-x">X</label>
              <input
                id="cam-x"
                name="cam-x"
                type="number"
                value={valuesForm.camX}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    camX: elem.value as unknown as number
                  })
                }
              />
            </div>
            <div className="input-container">
              <label htmlFor="cam-y">Y</label>
              <input
                id="cam-y"
                name="cam-y"
                type="number"
                value={valuesForm.camY}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    camY: elem.value as unknown as number
                  })
                }
              />
            </div>
            <div className="input-container">
              <label htmlFor="cam-z">Z</label>
              <input
                id="cam-z"
                name="cam-z"
                type="number"
                value={valuesForm.camZ}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    camZ: elem.value as unknown as number
                  })
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="input-container">
              <label htmlFor="cam-cx">CX</label>
              <input
                id="cam-cx"
                name="cam-cx"
                type="number"
                value={valuesForm.camCX}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    camCX: elem.value as unknown as number
                  })
                }
              />
            </div>
            <div className="input-container">
              <label htmlFor="cam-cy">CY</label>
              <input
                id="cam-cy"
                name="cam-cy"
                type="number"
                value={valuesForm.camCY}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    camCY: elem.value as unknown as number
                  })
                }
              />
            </div>
            <div className="input-container">
              <label htmlFor="cam-cz">CZ</label>
              <input
                id="cam-cz"
                name="cam-cz"
                type="number"
                value={valuesForm.camCZ}
                onChange={
                  ({ currentTarget: elem }) => setValuesForm({
                    ...valuesForm,
                    camCZ: elem.value as unknown as number
                  })
                }
              />
            </div>
          </div>
        </div>
        <div>
          <div className="input-container">
            <label htmlFor="fov">FOV</label>
            <input
              id="fov"
              name="fov"
              type="number"
              value={valuesForm.fov}
              onChange={
                ({ currentTarget: elem }) => setValuesForm({
                  ...valuesForm,
                  fov: elem.value as unknown as number
                })
              }
            />
          </div>
        </div>
        <div>
          <div className="input-container">
            <label htmlFor="ra">RA</label>
            <input
              id="ra"
              name="ra"
              type="number"
              value={valuesForm.ra}
              onChange={
                ({ currentTarget: elem }) => setValuesForm({
                  ...valuesForm,
                  ra: elem.value as unknown as number
                })
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="input-container">
            <label htmlFor="near">Near</label>
            <input
              id="near"
              name="near"
              type="number"
              value={valuesForm.near}
              onChange={
                ({ currentTarget: elem }) => setValuesForm({
                  ...valuesForm,
                  near: elem.value as unknown as number
                })
              }
            />
          </div>
          <div className="input-container">
            <label htmlFor="far">Far</label>
            <input
              id="far"
              name="far"
              type="number"
              value={valuesForm.far}
              onChange={
                ({ currentTarget: elem }) => setValuesForm({
                  ...valuesForm,
                  far: elem.value as unknown as number
                })
              }
            />
          </div>
        </div>
        <div className="input-container">
          <label htmlFor="project-type">Tipo de Projeção</label>
          <select
            value={valuesForm.project_type}
            onChange={
              ({ currentTarget: elem }) => setValuesForm({
                ...valuesForm,
                project_type: elem.value as unknown as number
              })
            }
            name="project-type"
            id="project-type"
          >
            <option value={0}>Perspectiva</option>
            <option value={1}>Ortho</option>
          </select>
        </div>
        <div className="row">
          <div className="input-container">
            <label htmlFor="x-min">Xmin</label>
            <input
              id="x-min"
              name="x-min"
              type="number"
              value={valuesForm.xMin}
              onChange={
                ({ currentTarget: elem }) => setValuesForm({
                  ...valuesForm,
                  xMin: elem.value as unknown as number
                })
              }
              disabled={valuesForm.project_type == 0 ? true : false}
            />
          </div>
          <div className="input-container">
            <label htmlFor="x-max">Xmax</label>
            <input
              id="x-max"
              name="x-max"
              type="number"
              value={valuesForm.xMax}
              onChange={
                ({ currentTarget: elem }) => setValuesForm({
                  ...valuesForm,
                  xMax: elem.value as unknown as number
                })
              }
              disabled={valuesForm.project_type == 0 ? true : false}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-container">
            <label htmlFor="y-min">Ymin</label>
            <input
              id="y-min"
              name="y-min"
              type="number"
              value={valuesForm.yMin}
              onChange={
                ({ currentTarget: elem }) => setValuesForm({
                  ...valuesForm,
                  yMin: elem.value as unknown as number
                })
              }
              disabled={valuesForm.project_type == 0 ? true : false}
            />
          </div>
          <div className="input-container">
            <label htmlFor="y-max">Ymax</label>
            <input
              id="y-max"
              name="y-max"
              type="number"
              value={valuesForm.yMax}
              onChange={
                ({ currentTarget: elem }) => setValuesForm({
                  ...valuesForm,
                  yMax: elem.value as unknown as number
                })
              }
              disabled={valuesForm.project_type == 0 ? true : false}
            />
          </div>
        </div>
      </div>
    </div >
  )
}

export default App;
