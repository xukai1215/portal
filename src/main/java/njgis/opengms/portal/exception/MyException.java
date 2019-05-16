package njgis.opengms.portal.exception;

import njgis.opengms.portal.enums.ResultEnum;

/**
 * @ClassName MyException
 * @Description todo
 * @Author sun_liber
 * @Date 2019/2/15
 * @Version 1.0.0
 */
public class MyException extends RuntimeException {
    private Integer code;

    public MyException(ResultEnum resultEnum) {
        super(resultEnum.getMsg());
        this.code = resultEnum.getCode();
    }


    public MyException(String msg) {
        super(msg);
        this.code = -99999;
    }

    public Integer getCode() {
        return code;
    }
}
