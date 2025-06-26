# IP AND CONTENT VALIDATION:

## No flagging:
go run validate_ip.go '{"request_data":{"message": "penis"}, "sender_ip":"127.0.0.1", "allowed_origins": ["1", "2", "127.0.0.1"], "flag":0}'

## 2 as flag (failed IP validation):
go run validate_ip.go '{"request_data":{"message": "penis"}, "sender_ip":"127.0.0.1", "allowed_origins": ["1", "2"], "flag":0}'

## 1 as flag (failed content validation):
go run validate_ip.go '{"request_data":{"message": "JS"}, "sender_ip":"127.0.0.1", "allowed_origins": ["1", "2", "127.0.0.1"], "flag":0}'

### OBS: ip flag is checked first, will kill process and not check for content validity