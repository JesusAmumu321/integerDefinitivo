#include <iostream>
#include <stdexcept>

void mostrarDinero(double dinero);
double depositar();
double retirar(double dinero);

using namespace std;

int main() {
    double dinero = 0;
    int opcion = 0;

    cout << "---------------------------------------------------- \n ";
    cout << "Bienvenido a Bancoppel, donde tu familia vive mejor. \n";

    do {
        cout << "Ingrese una opcion \n";
        cout << "1. Mostrar saldo \n";
        cout << "2. Depositar a la cuenta \n";
        cout << "3. Retirar \n";
        cout << "4. Salir \n";
        cin >> opcion;

        switch (opcion) {
            case 1:
                cout << "---------------------------------------------------- \n ";
                mostrarDinero(dinero);
                cout << "---------------------------------------------------- \n ";
                break;

            case 2:
                cout << "---------------------------------------------------- \n ";
                try {
                    dinero += depositar();
                } catch (const std::invalid_argument& e) {
                    cerr << "Error. " << e.what() << endl;
                    opcion = 10;
                }
                mostrarDinero(dinero);
                cout << "---------------------------------------------------- \n ";
                break;

            case 3:
                cout << "---------------------------------------------------- \n ";
                try {
                    dinero -= retirar(dinero);
                } catch (const std::invalid_argument& e) {
                    cerr << "Error. " << e.what() << endl;
                    opcion = 10;
                }
                mostrarDinero(dinero);
                cout << "---------------------------------------------------- \n ";
                break;

            default:
                if (opcion == 4) {
                    cout << "Vuelva pronto y no olvide pagar a tiempo \n";
                }

                if (opcion > 4) {
                    cout << "Por motivos de seguridad, se cerrara la sesion, no olvide su tarjeta";
                }
                break;
        }

    } while (opcion < 4);

    return 0;
}

void mostrarDinero(double dinero) {
    cout << "El dinero que contiene tu cuenta coppel: " << dinero << '\n';
}

double depositar() {
    double cantidadDep = 0;
    cout << "Ingrese la cantidad que desea depositar. \n";
    cin >> cantidadDep;

    if (cantidadDep <= 0) {
        throw std::invalid_argument("Ingrese valores correctos.");
    }

    return cantidadDep;
}

double retirar(double dinero) {
    double cantidadRet = 0;
    cout << "Ingrese la cantidad que desea retirar. \n";
    cin >> cantidadRet;

    if (cantidadRet > dinero) {
        throw std::invalid_argument("No tiene los fondos suficientes.");
    } else if (cantidadRet <= 0) {
        throw std::invalid_argument("Ingrese una opción válida.");
    }

    return cantidadRet;
}
