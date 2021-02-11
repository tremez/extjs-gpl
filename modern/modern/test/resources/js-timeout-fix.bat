@echo off
set REGFILE="%TEMP%\js-fix.reg"
> %REGFILE% (
@echo REGEDIT4
@echo.
@echo [HKEY_CURRENT_USER\Software\Microsoft\Internet Explorer\Styles]
@echo "MaxScriptStatements"=dword:ffffffff
@echo [HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings\ZoneMap\Domains]
@echo [HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings\ZoneMap\Domains\vpn-us.sencha.com]
@echo "http"=dword:00000001
@echo "https"=dword:00000001
@echo [HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings\ZoneMap\Domains\localhost.localdomain]
@echo "http"=dword:00000001
@echo "https"=dword:00000001
@echo.
)
regedit /s %REGFILE%
del %REGFILE%
