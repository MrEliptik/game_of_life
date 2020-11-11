# Game of life

*Note: I originally made this in Javascript, but due to poor performance on the rpi zero, I switched to Python. You can still find the code in the js folder*

## Touchscreen configuration 

In `/usr/share/X11/xorg.conf.d/99-calibration.conf`, I used the following

	Section "InputClass"
        	Identifier "calibration"
        	MatchProduct "ADS7846 Touchscreen"
        	Option "Calibration" "2707 2676 2989 3027"
        	Option "SwapAxes" "1"
        	Option "InvertY" "0"
        	Option "InvertX" "1"
        	Option "TransformationMatrix" "0 -1 1 1 0 0 0 0 1"
	EndSection
	
## Launching with python

	DISPLAY=:0 python3 game.py

## (JS) Launching chrome in kiosk

	DISPLAY=:0 chromium-browser --start-fullscreen --kiosk --noerrdialogs /home/pi/game_of_life_js/game.html
