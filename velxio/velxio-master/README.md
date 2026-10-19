# \# Velxio Simulator — Custom Fan Component Experiment

# 

# An experimental extension of the Velxio circuit simulator, exploring custom electronic components, animated hardware representations, and a future integration with a Python-based machine learning system.

# 

# \## Overview

# 

# This project explores modifying the Velxio simulator to introduce a custom DC fan component and investigate how simulated hardware can eventually interact with external machine learning predictions.

# 

# The work is part of a broader \*\*Data-Orchestrator\*\* project that includes a Python ML prediction service and a temperature-based hardware-control experiment.

# 

# \## Current Work

# 

# \### 1. Velxio source setup

# 

# \- Exported the Velxio simulator source code and extracted the project locally.

# \- Created a working copy within the Data-Orchestrator repository.

# \- Explored the simulator's frontend component structure to identify where a custom component could be added.

# 

# \### 2. Custom DC fan component

# 

# Created a custom TypeScript component:

# 

# `frontend/src/components/velxio-components/dcFanElement.ts`

# 

# The component introduces a custom element named `velxio-dc-fan`.

# 

# Work completed:

# 

# \- Added a custom fan representation.

# \- Implemented CSS-based blade rotation to simulate fan movement.

# \- Tested continuous animation by enabling the fan's running state.

# 

# \*\*Current result:\*\* The fan animation works as a visual prototype. The animation has been tested in a continuously running state; automatic control through a simulated GPIO pin is still planned.

# 

# \### 3. Version control

# 

# \- Added the Velxio source copy to the Data-Orchestrator Git repository.

# \- Created a local Git commit named `My Hosted Velxio Simulator`.

# \- Prepared the project for publishing to the remote GitHub repository.

# 

# \## Technology Stack

# 

# \- \*\*TypeScript\*\* — custom component implementation

# \- \*\*CSS\*\* — fan animation

# \- \*\*Velxio\*\* — circuit simulation environment

# \- \*\*Python\*\* — external ML prediction service in the broader project

# \- \*\*Git and GitHub\*\* — source control and project hosting

# 

# \## Planned Integration

# 

# The following are planned development steps, not yet claimed as completed features.

# 

# 1\. \*\*GPIO-based fan control:\*\* Connect the custom fan's running state to the simulated hardware output, targeting GP17.

# 2\. \*\*Temperature-driven behavior:\*\* Use temperature readings from the sensor experiment to determine when the fan should run.

# 3\. \*\*Python ML bridge:\*\* Connect the simulator to the existing local prediction service at `127.0.0.1:8000`.

# 4\. \*\*End-to-end testing:\*\* Verify that sensor data reaches the prediction service and that its response affects the simulated fan.

# 5\. \*\*Documentation and validation:\*\* Record test cases, expected behavior, and known limitations.

# 

# \## Project Status

# 

# | Feature | Status |

# |---|---|

# | Velxio source setup | Completed |

# | Custom fan element | Implemented |

# | CSS fan animation | Tested |

# | Continuous animation test | Successful |

# | GPIO-controlled animation | Planned |

# | Python ML integration with the custom component | In progress / planned |

# | End-to-end automated testing | Pending |

# 

# \## Running the Experiment

# 

# The custom component currently serves as a development prototype inside the Velxio source tree.

# 

# To run the simulator, follow the installation and development instructions provided by the original Velxio project. The exact build and launch commands depend on the source version and installed dependencies.

# 

# The Python prediction service is a separate part of the broader Data-Orchestrator project and must be running independently when testing its API.

# 

# \## Future Scope

# 

# \- Connect the fan animation to actual simulated GPIO state changes.

# \- Integrate sensor readings with Python-based ML predictions.

# \- Automate fan and indicator behavior based on prediction results.

# \- Add reproducible tests and screenshots demonstrating the complete workflow.

# 

# \## Attribution and Licensing

# 

# This project builds on the Velxio simulator source code. Refer to the original project's repository, license, and copyright notices for attribution and redistribution requirements.

# 

# Retain the original license and notices, and ensure that modifications and redistributed copies comply with the applicable license.

# 

# \## Acknowledgements

# 

# Built as an experimental component-development and hardware/ML integration effort within the Data-Orchestrator project.



