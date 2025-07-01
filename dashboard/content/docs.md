# SmartPyLogger Documentation

```text
....................................................................................
....................................................................................
..........................................-++=..:...................................
.............-.........................=**#######+:.........-.......................
.............................-.......:=#***##**##*=.....................-...........
......-.............................:+******#**##*#=................................
.............-...................:=*********####%##*:...............................
..............................:+************#*####=..................-..............
...-*+=:.................-=****##*****####*######%+:................................
...-*#*#**##*********##**#*******#######**#%%#***#%+................................
...:=*****#*##*######****#*****#####*#*++--*%##***##=.........-.....................
....-******###*##**###**###*#*###****+-...:-*%%#**##%-..................-...........
....:=******###*###****#**#**#####**+:......-*%##***%#-.............................
.....:+*#***##***###******##**###**+:.......:-*%##**#%*-............................
......-*#****######***#**#*##*##**+:.........:-*%#*+*#%#:...........................
......:-*******#**********#***##**-...........-:=*##***#%*:.........................
........:-+#***************##**##**-............:=*##****#%*-.......................
............:=*#************+*###*#+.............-=*###**#%@%#-.....................
.............:-+#*************+*###*-......-......:-+*#%####%%*:....................
.......-.......:-=*#***************+.................-=*#%%%*###%=..................
..................:--##*************-.................:-+*%#****#%*.................
............-.......:--+#************#..................-=*#%#**#%%%-...............
........................::*********--+:...................:-=*###***#%*.............
.../PPPP/PPPPPPPPP..........++#*****--#....................:-=+###*#%%%.............
..| PPPPPPPPPPPPPPP..............-'++-#......................:=#%#***%%+............
..| PPPP_______/PPPP..-.........................-.............:=#%#***%%+...........
..| PPPP......| PPPP..........................................:=#%#***%%+...........
..| PPPPPPPPPPPPPPP./YYYY..../YYYY........-...................:=#%#***%%+...........
..| PPPP/PPPPPPPP..| YYYY...| YYYY............................:=*%##**#%#-..........
..| PPPP_______/...| YYYY...| YYYY.............................=*%%##*#%%=..........
..| PPPP............\ YYYYYYYYYYYY.....ooo....................=+%%%#**%%+...........
..| PPPP.............\ YYYYY_/YYYY.../OOOOO....-.............:=+###**#%#:...........
../____/..............\___/.| YYYY...| OOO...................=+#%#**#%#:............
...................../YYYY..| YYYY....\__/.................:=+***++++**-............
.............-......| YYYYY/ YYYYY...-..............................................
.....................\ YYYYYYYYYY...................................................
.......-..............\________/....................................................
....................................................................................
....................................................................................
```

Thank you so much for downloading and using SmartPyLogger!
Developed by Niklavs Visockis, Ludvig Bergström and Jonas Lorenz -
in June of 2025 at the Couchbase x AWS x Cillers Hackathon.
Special thanks goes out to the Couchbase team and AWS for sponsoring this project.

## Overview

**SmartPyLogger** is a FastAPI middleware for comprehensive request/response logging with advanced filtering, censorship, and AI-powered analysis capabilities.

## Installation

```bash
pip install smartpylogger
```

## Quick Start

```python
from fastapi import FastAPI
from smartpylogger import LoggingMiddleware

app = FastAPI()

# Add your middleware
app.add_middleware(
    LoggingMiddleware,
    api_key="YOUR_API_KEY", # Get an api key and 10 free credits on our landing page!
    allowed_origins=["IP", ...], # Origins you want to allow, CORS-style [*] not supported yet
    censored_words="words.txt", # Path to csv-style words you would liked flagged,
                                # in case they are found in the request body
    )
```

## Configuration Options

### Required Parameters

- **`api_key`**: Your API key for accessing SmartPyLogger services. Get one with 10 free credits on our landing page!

### Optional Parameters

- **`allowed_origins`**: List of IP addresses or origins you want to allow. CORS-style wildcard `[*]` is not supported yet.
- **`censored_words`**: Path to a CSV-style file containing words you'd like to flag if found in request bodies.

## What SmartPyLogger Logs

SmartPyLogger captures comprehensive information about each request:

- **Time**: Timestamp of the request
- **Request Body**: Complete contents of the request
- **Request Type**: HTTP method (POST, GET, PUT, DELETE, etc.)
- **Sender IP Address**: Origin IP of the request
- **Flag**: Status indicator
  - `1` if flagged for censorship
  - `2` if blocked origin
- **App Name**: Keeps your applications separate while maintaining centralized logging

## Features

### 🔍 **Comprehensive Logging**

Every request and response is logged with detailed metadata for complete visibility into your API usage.

### 🛡️ **Advanced Filtering**

- IP-based origin filtering
- Content censorship based on keyword detection
- Flexible configuration options

### 🤖 **AI-Powered Analysis**

- Intelligent request pattern analysis
- Automated threat detection
- Smart filtering recommendations

### ⚡ **Performance Optimized**

- Minimal impact on your API performance
- Efficient middleware implementation
- Scalable architecture

## Use Cases

### Development & Debugging

- Track API usage patterns during development
- Debug issues with detailed request/response logging
- Monitor API performance and behavior

### Security & Monitoring

- Detect suspicious request patterns
- Block malicious IP addresses
- Filter inappropriate content automatically

### Analytics & Insights

- Understand your API usage patterns
- Generate insights from request data
- Monitor application health and performance

## Advanced Configuration

### Custom Censorship Rules

Create a `censored_words.txt` file with words or patterns you want to flag:

```text
spam
malicious
inappropriate_term
```

### Origin Allowlist Configuration

```python
app.add_middleware(
    LoggingMiddleware,
    api_key="YOUR_API_KEY",
    allowed_origins=[
        "192.168.1.1",
        "10.0.0.1",
        "trusted-domain.com"
    ],
    censored_words="my_banned_words.txt"
)
```

## Getting Started

1. **Install SmartPyLogger**: `pip install smartpylogger`
2. **Get your API key**: Visit our landing page for 10 free credits
3. **Add the middleware**: Configure SmartPyLogger in your FastAPI app
4. **Start logging**: Your requests are now being monitored and analyzed

## Support & Community

- **Documentation**: Visit our comprehensive docs
- **Issues**: Report bugs and feature requests
- **Community**: Join our developer community

Built with ❤️ by the SmartPyLogger team during the Couchbase x AWS x Cillers Hackathon.
