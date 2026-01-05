import './PersonalSection.css'
import Input from '../../../components/ui/Input/Input'

export default function PersonalSection({ register, errors, submitCount, patterns, userEmail }) {
    const showErr = (k) => !!errors?.[k] && submitCount > 0

    return (
        <>
            <div className="dr-secTitle">ข้อมูลส่วนตัว</div>

            <div className="dr-grid2">
                <div className={`dr-field ${showErr('firstName') ? 'has-error' : ''}`}>
                    <div className="dr-label">ชื่อ</div>
                    <Input placeholder="ชื่อ" {...register('firstName')} />
                    {showErr('firstName') && <div className="dr-error">กรุณากรอกชื่อ</div>}
                </div>

                <div className={`dr-field ${showErr('lastName') ? 'has-error' : ''}`}>
                    <div className="dr-label">นามสกุล</div>
                    <Input placeholder="นามสกุล" {...register('lastName')} />
                    {showErr('lastName') && <div className="dr-error">กรุณากรอกนามสกุล</div>}
                </div>
            </div>

            <div className="dr-grid2">
                <div className={`dr-field ${showErr('idCard') ? 'has-error' : ''}`}>
                    <div className="dr-label">เลขประจำตัวประชาชน</div>
                    <Input
                        placeholder="13 หลัก"
                        inputMode="numeric"
                        {...register('idCard', { pattern: patterns.ID_PATTERN })}
                    />
                    {showErr('idCard') && <div className="dr-error">กรุณากรอกเลขบัตรให้ถูกต้อง</div>}
                </div>

                <div className={`dr-field ${showErr('birthDate') ? 'has-error' : ''}`}>
                    <div className="dr-label">วันเกิด</div>
                    <Input type="date" {...register('birthDate')} />
                    {showErr('birthDate') && <div className="dr-error">กรุณาเลือกวันเกิด</div>}
                </div>
            </div>

            <div className="dr-grid2">
                <div className={`dr-field ${showErr('phone') ? 'has-error' : ''}`}>
                    <div className="dr-label">เบอร์โทรศัพท์</div>
                    <Input
                        placeholder="0812345678"
                        inputMode="numeric"
                        {...register('phone', { pattern: patterns.PHONE_PATTERN })}
                    />
                    {showErr('phone') && <div className="dr-error">กรุณากรอกเบอร์โทรให้ถูกต้อง</div>}
                </div>

                <div className="dr-field">
                    <div className="dr-label">E-mail</div>
                    <Input
                        value={userEmail || ''}
                        readOnly
                        tabIndex={-1}
                        className="dr-inputLocked"
                        placeholder="example@email.com"
                    />
                </div>
            </div>

            <hr className="dr-divider" />
        </>
    )
}
