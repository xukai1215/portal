package njgis.opengms.portal.enums;

/**
 * @EnumName ResultEnum
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/15
 * @Version 1.0.0
 */
public enum ResultEnum {
    SUCCESS(0, "Success"),
    NO_OBJECT(-1, "No object"),
    ERROR(-2,"Error");

    private Integer code;

    private String msg;

    ResultEnum(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public Integer getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }
}
