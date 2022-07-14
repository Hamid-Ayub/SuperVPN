package surf.express.nord.proton.vpn.presentation.ui.forgotpassword

import android.view.View
import surf.express.nord.proton.vpn.R
import surf.express.nord.proton.vpn.databinding.FragmentForgotPasswordBinding
import surf.express.nord.proton.vpn.presentation.base.BaseFragment
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class ForgotPasswordFragment :
    BaseFragment<FragmentForgotPasswordBinding>(R.layout.fragment_forgot_password) {

    override fun initBinding(view: View): FragmentForgotPasswordBinding {
        return FragmentForgotPasswordBinding.bind(view)
    }

    override fun initView() {
    }
}