const stubs = {};

stubs.cpp = `#include <iostream>
#include <stdio.h>

using namespace std;

int main(){
  cout<<"Hello\\n";
  return 0;  
}
`;

stubs.py = `print("Hello")`;

export default stubs;
