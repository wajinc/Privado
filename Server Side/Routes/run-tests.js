// C:\Users\Wilso\Privado\Server Side\Routes\run-tests.js

import express from 'express';
import { exec } from 'child_process';  // Para ejecutar comandos de shell
const router = express.Router();

// Ruta para ejecutar las pruebas automatizadas
router.post('/run-tests', (req, res) => {
    exec('npm test', (error, stdout, stderr) => {
        if (error) {
            console.error('Error al ejecutar las pruebas:', error);
            return res.status(500).json({ status: 'error', message: 'Hubo un error al ejecutar las pruebas' });
        }
        if (stderr) {
            console.error('stderr:', stderr);
            return res.status(500).json({ status: 'error', message: stderr });
        }
        console.log('stdout:', stdout);
        return res.json({ status: 'success', message: 'Pruebas ejecutadas con éxito', data: stdout });
    });
});

export { router };
