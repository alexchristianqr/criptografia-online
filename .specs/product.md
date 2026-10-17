# Producto

Plataforma web para aprender criptografía con lecciones interactivas: definición, teoría, práctica y laboratorio dinámico.

## Público
Estudiantes y autodidactas sin base previa en criptografía.

## Cursos
Registrados en `src/courses.ts`. Cada curso tiene su spec en `features/<nombre>/`.

## Principios
- Aprender haciendo: cada cifrado tiene un laboratorio interactivo.
- Todo se ejecuta en el navegador; sin backend.
- Interfaz en español, tema claro/oscuro/sistema.
- **Entrada a demanda:** en todo cifrado el usuario puede ingresar su propia clave y texto, tanto en el laboratorio como en la práctica resuelta, para comparar con ejemplos reales (de libros o de su universidad). Toda clave se valida con una función pura probada y los errores explican por qué; mientras la entrada es inválida se conserva el último resultado válido y no se muestra uno obsoleto. Cada módulo ofrece «cargar/restaurar ejemplo».
